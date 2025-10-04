import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const HeroSection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6rem 0;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
    opacity: 0.3;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.1;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const CTAButtons = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const FeatureSection = styled.section`
  padding: 6rem 0;
  background: white;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const FeatureCard = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  border-radius: 1rem;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1a202c;
`;

const FeatureDescription = styled.p`
  color: #6b7280;
  line-height: 1.6;
`;

const StatsSection = styled.section`
  background: #1a202c;
  color: white;
  padding: 4rem 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
`;

const StatItem = styled(motion.div)`
  padding: 1rem;
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1.125rem;
  color: #9ca3af;
`;

const HowItWorksSection = styled.section`
  padding: 6rem 0;
  background: #f8fafc;
`;

const HowItWorksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const StepCard = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  position: relative;

  &::before {
    content: '${props => props.stepNumber}';
    position: absolute;
    top: -1rem;
    left: 50%;
    transform: translateX(-50%);
    width: 2rem;
    height: 2rem;
    background: #3b82f6;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
  }
`;

const StepTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1a202c;
`;

const StepDescription = styled.p`
  color: #6b7280;
  line-height: 1.6;
`;

const CTA = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 1rem 2rem;
  background: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1.125rem;
  transition: all 0.3s ease;
  gap: 0.5rem;

  &:hover {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
`;

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <HeroSection>
        <HeroContent>
          <HeroTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Design Your Dream Home with AI
          </HeroTitle>
          <HeroSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Create stunning 2D floorplans, immersive 3D visualizations, and 360° walkthroughs 
            with AI-powered interior design suggestions. Professional-grade tools for everyone.
          </HeroSubtitle>
          <CTAButtons
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <CTA to="/register">
              Start Designing Free
              <span>→</span>
            </CTA>
            <Link to="/gallery" className="btn btn-outline btn-lg" style={{ color: 'white', borderColor: 'white' }}>
              View Gallery
            </Link>
          </CTAButtons>
        </HeroContent>
      </HeroSection>

      <FeatureSection>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Powerful Features</h2>
            <p style={{ fontSize: '1.125rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
              Everything you need to design, visualize, and plan your perfect space
            </p>
          </motion.div>

          <FeatureGrid
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <FeatureCard variants={itemVariants}>
              <FeatureIcon>📐</FeatureIcon>
              <FeatureTitle>2D Floorplan Editor</FeatureTitle>
              <FeatureDescription>
                Drag-and-drop room creation with interactive dimension arrows. 
                Automatic room labeling and precise measurements.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard variants={itemVariants}>
              <FeatureIcon>🏠</FeatureIcon>
              <FeatureTitle>3D Visualization</FeatureTitle>
              <FeatureDescription>
                Realistic 3D models with furniture placement, lighting, 
                and real-time updates from your 2D designs.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard variants={itemVariants}>
              <FeatureIcon>🌐</FeatureIcon>
              <FeatureTitle>360° Walkthrough</FeatureTitle>
              <FeatureDescription>
                Immersive panoramic navigation with hotspots between rooms. 
                Experience your design like you're really there.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard variants={itemVariants}>
              <FeatureIcon>🤖</FeatureIcon>
              <FeatureTitle>AI Interior Design</FeatureTitle>
              <FeatureDescription>
                Upload reference photos or describe your style. 
                Get AI-powered furniture suggestions and color schemes.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard variants={itemVariants}>
              <FeatureIcon>💰</FeatureIcon>
              <FeatureTitle>Cost Estimation</FeatureTitle>
              <FeatureDescription>
                Real-time price estimates with material breakdowns. 
                Generate professional BOQ reports automatically.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard variants={itemVariants}>
              <FeatureIcon>👥</FeatureIcon>
              <FeatureTitle>Collaboration</FeatureTitle>
              <FeatureDescription>
                Work together in real-time with family, friends, or professionals. 
                Comment, suggest changes, and track versions.
              </FeatureDescription>
            </FeatureCard>
          </FeatureGrid>
        </div>
      </FeatureSection>

      <StatsSection>
        <StatsGrid
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <StatItem variants={itemVariants}>
            <StatNumber>10K+</StatNumber>
            <StatLabel>Happy Users</StatLabel>
          </StatItem>
          <StatItem variants={itemVariants}>
            <StatNumber>50K+</StatNumber>
            <StatLabel>Floorplans Created</StatLabel>
          </StatItem>
          <StatItem variants={itemVariants}>
            <StatNumber>95%</StatNumber>
            <StatLabel>User Satisfaction</StatLabel>
          </StatItem>
          <StatItem variants={itemVariants}>
            <StatNumber>24/7</StatNumber>
            <StatLabel>AI Support</StatLabel>
          </StatItem>
        </StatsGrid>
      </StatsSection>

      <HowItWorksSection>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>How It Works</h2>
            <p style={{ fontSize: '1.125rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
              Get started in minutes with our intuitive design process
            </p>
          </motion.div>

          <HowItWorksGrid
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <StepCard stepNumber="1" variants={itemVariants}>
              <StepTitle>Create Your Plan</StepTitle>
              <StepDescription>
                Start with a blank canvas or choose from our templates. 
                Draw rooms, add walls, and set dimensions with our intuitive editor.
              </StepDescription>
            </StepCard>

            <StepCard stepNumber="2" variants={itemVariants}>
              <StepTitle>Design & Decorate</StepTitle>
              <StepDescription>
                Use AI to suggest furniture, colors, and materials. 
                Upload reference photos or describe your style preferences.
              </StepDescription>
            </StepCard>

            <StepCard stepNumber="3" variants={itemVariants}>
              <StepTitle>Visualize & Share</StepTitle>
              <StepDescription>
                Explore your design in 3D and 360° views. 
                Share with family, get cost estimates, and download your plans.
              </StepDescription>
            </StepCard>
          </HowItWorksGrid>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginTop: '4rem' }}
          >
            <CTA to="/register">
              Start Your First Design
              <span>→</span>
            </CTA>
          </motion.div>
        </div>
      </HowItWorksSection>
    </>
  );
};

export default Home;
