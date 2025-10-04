const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const auth = require('../middleware/auth');
const Floorplan = require('../models/Floorplan');
const User = require('../models/User');

const router = express.Router();

// @route   POST /api/payments/create-intent
// @desc    Create payment intent for floorplan download
// @access  Private
router.post('/create-intent', auth, async (req, res) => {
  try {
    const { floorplanId, planType } = req.body;

    if (!floorplanId || !planType) {
      return res.status(400).json({ message: 'Floorplan ID and plan type are required' });
    }

    // Get floorplan
    const floorplan = await Floorplan.findById(floorplanId);
    if (!floorplan) {
      return res.status(404).json({ message: 'Floorplan not found' });
    }

    // Check if user owns the floorplan
    if (floorplan.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Calculate amount based on plan type
    const amount = calculatePlanAmount(planType);
    
    // Get or create Stripe customer
    const user = await User.findById(req.userId);
    let customerId = user.subscription.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user._id.toString()
        }
      });
      
      customerId = customer.id;
      user.subscription.stripeCustomerId = customerId;
      await user.save();
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      customer: customerId,
      metadata: {
        floorplanId: floorplanId,
        planType: planType,
        userId: req.userId
      },
      description: `ArchGen ${planType} plan for ${floorplan.title}`
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amount
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ message: 'Failed to create payment intent' });
  }
});

// @route   POST /api/payments/confirm
// @desc    Confirm payment and grant access
// @access  Private
router.post('/confirm', auth, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ message: 'Payment intent ID is required' });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    // Verify the payment belongs to the user
    if (paymentIntent.metadata.userId !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const floorplanId = paymentIntent.metadata.floorplanId;
    const planType = paymentIntent.metadata.planType;

    // Update user subscription
    const user = await User.findById(req.userId);
    const subscription = await updateUserSubscription(user, planType, paymentIntent);

    // Grant download access
    await grantDownloadAccess(floorplanId, req.userId, planType);

    res.json({
      message: 'Payment confirmed successfully',
      subscription: subscription,
      downloadUrl: `/api/floorplans/${floorplanId}/download`
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ message: 'Failed to confirm payment' });
  }
});

// @route   POST /api/payments/subscribe
// @desc    Create subscription for premium features
// @access  Private
router.post('/subscribe', auth, async (req, res) => {
  try {
    const { priceId, paymentMethodId } = req.body;

    if (!priceId || !paymentMethodId) {
      return res.status(400).json({ message: 'Price ID and payment method are required' });
    }

    const user = await User.findById(req.userId);
    
    // Get or create Stripe customer
    let customerId = user.subscription.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user._id.toString()
        }
      });
      
      customerId = customer.id;
      user.subscription.stripeCustomerId = customerId;
      await user.save();
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Set as default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    res.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      status: subscription.status
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ message: 'Failed to create subscription' });
  }
});

// @route   POST /api/payments/cancel-subscription
// @desc    Cancel user subscription
// @access  Private
router.post('/cancel-subscription', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user.subscription.stripeSubscriptionId) {
      return res.status(400).json({ message: 'No active subscription found' });
    }

    // Cancel subscription in Stripe
    const subscription = await stripe.subscriptions.update(
      user.subscription.stripeSubscriptionId,
      {
        cancel_at_period_end: true
      }
    );

    // Update user subscription
    user.subscription.type = 'free';
    user.subscription.expiresAt = new Date(subscription.current_period_end * 1000);
    await user.save();

    res.json({
      message: 'Subscription will be cancelled at the end of the current period',
      cancelAt: new Date(subscription.current_period_end * 1000)
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ message: 'Failed to cancel subscription' });
  }
});

// @route   GET /api/payments/billing-history
// @desc    Get user's billing history
// @access  Private
router.get('/billing-history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user.subscription.stripeCustomerId) {
      return res.json({ invoices: [] });
    }

    // Get invoices from Stripe
    const invoices = await stripe.invoices.list({
      customer: user.subscription.stripeCustomerId,
      limit: 20
    });

    const billingHistory = invoices.data.map(invoice => ({
      id: invoice.id,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: invoice.status,
      date: new Date(invoice.created * 1000),
      description: invoice.description,
      downloadUrl: invoice.invoice_pdf
    }));

    res.json({ invoices: billingHistory });
  } catch (error) {
    console.error('Get billing history error:', error);
    res.status(500).json({ message: 'Failed to get billing history' });
  }
});

// @route   POST /api/payments/webhook
// @desc    Handle Stripe webhooks
// @access  Public
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSucceeded(event.data.object);
      break;
    case 'invoice.payment_succeeded':
      await handleInvoicePaymentSucceeded(event.data.object);
      break;
    case 'invoice.payment_failed':
      await handleInvoicePaymentFailed(event.data.object);
      break;
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

// Helper functions
function calculatePlanAmount(planType) {
  const prices = {
    'basic': 2900,    // $29.00
    'pro': 4900,      // $49.00
    'premium': 9900,  // $99.00
    'download': 500   // $5.00
  };
  
  return prices[planType] || 500;
}

async function updateUserSubscription(user, planType, paymentIntent) {
  const subscriptionTypes = {
    'basic': 'premium',
    'pro': 'pro',
    'premium': 'premium',
    'download': user.subscription.type // Keep current type for one-time downloads
  };

  user.subscription.type = subscriptionTypes[planType] || 'free';
  user.subscription.stripeSubscriptionId = paymentIntent.id;
  user.subscription.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  
  await user.save();
  
  return user.subscription;
}

async function grantDownloadAccess(floorplanId, userId, planType) {
  // In a real implementation, you would:
  // 1. Create a download token
  // 2. Store it in the database with expiration
  // 3. Grant access to high-resolution exports
  
  console.log(`Granted ${planType} download access to user ${userId} for floorplan ${floorplanId}`);
}

async function handlePaymentSucceeded(paymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id);
  // Handle successful payment
}

async function handleInvoicePaymentSucceeded(invoice) {
  console.log('Invoice payment succeeded:', invoice.id);
  // Handle successful subscription payment
}

async function handleInvoicePaymentFailed(invoice) {
  console.log('Invoice payment failed:', invoice.id);
  // Handle failed subscription payment
}

async function handleSubscriptionUpdated(subscription) {
  console.log('Subscription updated:', subscription.id);
  // Handle subscription updates
}

async function handleSubscriptionDeleted(subscription) {
  console.log('Subscription deleted:', subscription.id);
  // Handle subscription cancellation
}

module.exports = router;
