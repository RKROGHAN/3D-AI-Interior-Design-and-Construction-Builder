import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const PricingContainer = styled.div`
  min-height: calc(100vh - 70px);
  background: #f8fafc;
  padding: 4rem 0;
`;

const PricingHeader = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
  margin-bottom: 4rem;
`;

const PricingTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const PricingSubtitle = styled.p`
  font-size: 1.25rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const BillingToggle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
`;

const BillingLabel = styled.span`
  color: #6b7280;
  font-weight: 500;
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 60px;
  height: 30px;
  background: #e5e7eb;
  border-radius: 15px;
  cursor: pointer;
  transition: background 0.3s ease;

  &.active {
    background: #3b82f6;
  }
`;

const ToggleSlider = styled.div`
  position: absolute;
  top: 3px;
  left: 3px;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  ${ToggleSwitch}.active & {
    transform: translateX(30px);
  }
`;

const PricingGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PricingCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 2px solid #e5e7eb;
  padding: 2rem;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }

  &.featured {
    border-color: #3b82f6;
    transform: scale(1.05);

    &::before {
      content: 'Most Popular';
      position: absolute;
      top: -1rem;
      left: 50%;
      transform: translateX(-50%);
      background: #3b82f6;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
    }
  }
`;

const PlanHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const PlanName = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
`;

const PlanDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const PlanPrice = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
`;

const PriceAmount = styled.span`
  font-size: 3rem;
  font-weight: 700;
  color: #1a202c;
`;

const PriceCurrency = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  color: #6b7280;
`;

const PricePeriod = styled.span`
  color: #6b7280;
  font-size: 0.875rem;
`;

const PlanFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

const FeatureIcon = styled.span`
  color: #10b981;
  font-size: 1.125rem;
`;

const FeatureText = styled.span`
  color: #374151;
  font-size: 0.875rem;
`;

const PlanButton = styled(Link)`
  width: 100%;
  padding: 1rem;
  background: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  text-align: center;
  transition: all 0.2s ease;
  display: block;

  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }

  &.secondary {
    background: white;
    color: #3b82f6;
    border: 2px solid #3b82f6;

    &:hover {
      background: #3b82f6;
      color: white;
    }
  }
`;

const FeaturesSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  margin-bottom: 4rem;
`;

const FeaturesTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  text-align: center;
  margin-bottom: 3rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  text-align: center;
`;

const FeatureIconLarge = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const FAQSection = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const FAQTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  text-align: center;
  margin-bottom: 3rem;
`;

const FAQItem = styled.div`
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  margin-bottom: 1rem;
  overflow: hidden;
`;

const FAQQuestion = styled.button`
  width: 100%;
  padding: 1.5rem;
  background: none;
  border: none;
  text-align: left;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s ease;

  &:hover {
    background: #f9fafb;
  }
`;

const FAQAnswer = styled.div`
  padding: 0 1.5rem 1.5rem;
  color: #6b7280;
  line-height: 1.6;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const CTA = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
  margin-top: 4rem;
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CTADescription = styled.p`
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: white;
  color: #3b82f6;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1.125rem;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
`;

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for getting started',
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        'Up to 3 floorplans',
        'Basic 2D editor',
        'Standard templates',
        'Community support',
        'Basic export options'
      ],
      buttonText: 'Get Started Free',
      buttonLink: '/register',
      buttonClass: 'secondary'
    },
    {
      name: 'Pro',
      description: 'For serious designers and professionals',
      monthlyPrice: 29,
      annualPrice: 290,
      features: [
        'Unlimited floorplans',
        'Advanced 2D & 3D editor',
        'AI design assistant',
        'Premium templates',
        '360° walkthroughs',
        'Cost estimation',
        'Priority support',
        'HD exports'
      ],
      buttonText: 'Start Pro Trial',
      buttonLink: '/register?plan=pro',
      buttonClass: 'primary',
      featured: true
    },
    {
      name: 'Enterprise',
      description: 'For teams and large organizations',
      monthlyPrice: 99,
      annualPrice: 990,
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Custom branding',
        'API access',
        'Advanced analytics',
        'Dedicated support',
        'Custom integrations',
        'White-label options'
      ],
      buttonText: 'Contact Sales',
      buttonLink: '/contact',
      buttonClass: 'secondary'
    }
  ];

  const features = [
    {
      icon: '🎨',
      title: 'AI-Powered Design',
      description: 'Get intelligent suggestions for layouts, furniture, and color schemes'
    },
    {
      icon: '🏠',
      title: '2D, 3D & 360° Views',
      description: 'Visualize your designs from every angle with our advanced rendering'
    },
    {
      icon: '💰',
      title: 'Cost Estimation',
      description: 'Get real-time cost estimates and generate professional BOQ reports'
    },
    {
      icon: '👥',
      title: 'Collaboration',
      description: 'Work together with team members, clients, and contractors in real-time'
    },
    {
      icon: '📱',
      title: 'Cross-Platform',
      description: 'Access your designs on any device - desktop, tablet, or mobile'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your designs are protected with enterprise-grade security'
    }
  ];

  const faqs = [
    {
      question: 'Can I change my plan anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any billing differences.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! All paid plans come with a 14-day free trial. No credit card required to start.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.'
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Absolutely. You can cancel your subscription at any time from your account settings. No cancellation fees.'
    },
    {
      question: 'Do you offer educational discounts?',
      answer: 'Yes, we offer special pricing for students and educators. Contact us for more information.'
    },
    {
      question: 'What happens to my data if I cancel?',
      answer: 'Your data remains accessible for 30 days after cancellation. You can export all your designs during this period.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <PricingContainer>
      <PricingHeader>
        <PricingTitle>Simple, Transparent Pricing</PricingTitle>
        <PricingSubtitle>
          Choose the perfect plan for your needs. Start free and upgrade anytime.
        </PricingSubtitle>

        <BillingToggle>
          <BillingLabel>Monthly</BillingLabel>
          <ToggleSwitch
            className={isAnnual ? 'active' : ''}
            onClick={() => setIsAnnual(!isAnnual)}
          >
            <ToggleSlider />
          </ToggleSwitch>
          <BillingLabel>Annual (Save 20%)</BillingLabel>
        </BillingToggle>
      </PricingHeader>

      <PricingGrid>
        {plans.map((plan, index) => (
          <PricingCard
            key={plan.name}
            className={plan.featured ? 'featured' : ''}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <PlanHeader>
              <PlanName>{plan.name}</PlanName>
              <PlanDescription>{plan.description}</PlanDescription>
              <PlanPrice>
                <PriceCurrency>$</PriceCurrency>
                <PriceAmount>
                  {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                </PriceAmount>
                <PricePeriod>
                  /{isAnnual ? 'year' : 'month'}
                </PricePeriod>
              </PlanPrice>
            </PlanHeader>

            <PlanFeatures>
              {plan.features.map((feature, featureIndex) => (
                <FeatureItem key={featureIndex}>
                  <FeatureIcon>✓</FeatureIcon>
                  <FeatureText>{feature}</FeatureText>
                </FeatureItem>
              ))}
            </PlanFeatures>

            <PlanButton
              to={plan.buttonLink}
              className={plan.buttonClass}
            >
              {plan.buttonText}
            </PlanButton>
          </PricingCard>
        ))}
      </PricingGrid>

      <FeaturesSection>
        <FeaturesTitle>Why Choose ArchGen?</FeaturesTitle>
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index}>
              <FeatureIconLarge>{feature.icon}</FeatureIconLarge>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesSection>

      <FAQSection>
        <FAQTitle>Frequently Asked Questions</FAQTitle>
        {faqs.map((faq, index) => (
          <FAQItem key={index}>
            <FAQQuestion onClick={() => toggleFAQ(index)}>
              {faq.question}
              <span>{openFAQ === index ? '−' : '+'}</span>
            </FAQQuestion>
            <FAQAnswer isOpen={openFAQ === index}>
              {faq.answer}
            </FAQAnswer>
          </FAQItem>
        ))}
      </FAQSection>

      <CTA>
        <CTATitle>Ready to Start Designing?</CTATitle>
        <CTADescription>
          Join thousands of designers, architects, and homeowners who trust ArchGen 
          to bring their vision to life.
        </CTADescription>
        <CTAButton to="/register">
          ➕ Start Your Free Trial
        </CTAButton>
      </CTA>
    </PricingContainer>
  );
};

export default Pricing;
