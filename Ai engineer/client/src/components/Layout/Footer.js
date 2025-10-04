import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: #1a202c;
  color: white;
  padding: 3rem 0 1rem;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FooterTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #e2e8f0;
`;

const FooterLink = styled(Link)`
  color: #a0aec0;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s ease;

  &:hover {
    color: #3b82f6;
  }
`;

const ExternalLink = styled.a`
  color: #a0aec0;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s ease;

  &:hover {
    color: #3b82f6;
  }
`;

const FooterDescription = styled.p`
  color: #a0aec0;
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #2d3748;
  color: #a0aec0;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: #3b82f6;
    color: white;
    transform: translateY(-2px);
  }
`;

const NewsletterSection = styled.div`
  background: #2d3748;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const NewsletterTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #e2e8f0;
`;

const NewsletterDescription = styled.p`
  color: #a0aec0;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: 0.5rem;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #4a5568;
  border-radius: 0.5rem;
  background: #1a202c;
  color: white;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

const NewsletterButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #2563eb;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid #2d3748;
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: #a0aec0;
  font-size: 0.875rem;
  margin: 0;
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 1.5rem;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const LegalLink = styled(Link)`
  color: #a0aec0;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s ease;

  &:hover {
    color: #3b82f6;
  }
`;

const Footer = () => {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription');
  };

  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          <FooterSection>
            <FooterTitle>🏠 ArchGen</FooterTitle>
            <FooterDescription>
              The ultimate AI-powered floorplan and interior design platform. 
              Create stunning 2D, 3D, and 360° visualizations with professional-grade tools.
            </FooterDescription>
            <SocialLinks>
              <SocialLink href="#" aria-label="Twitter">
                🐦
              </SocialLink>
              <SocialLink href="#" aria-label="Facebook">
                📘
              </SocialLink>
              <SocialLink href="#" aria-label="Instagram">
                📷
              </SocialLink>
              <SocialLink href="#" aria-label="LinkedIn">
                💼
              </SocialLink>
            </SocialLinks>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Product</FooterTitle>
            <FooterLink to="/features">Features</FooterLink>
            <FooterLink to="/pricing">Pricing</FooterLink>
            <FooterLink to="/gallery">Gallery</FooterLink>
            <FooterLink to="/templates">Templates</FooterLink>
            <FooterLink to="/api">API</FooterLink>
            <ExternalLink href="#" target="_blank" rel="noopener noreferrer">
              Documentation
            </ExternalLink>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Resources</FooterTitle>
            <ExternalLink href="#" target="_blank" rel="noopener noreferrer">
              Blog
            </ExternalLink>
            <ExternalLink href="#" target="_blank" rel="noopener noreferrer">
              Tutorials
            </ExternalLink>
            <ExternalLink href="#" target="_blank" rel="noopener noreferrer">
              Help Center
            </ExternalLink>
            <ExternalLink href="#" target="_blank" rel="noopener noreferrer">
              Community
            </ExternalLink>
            <ExternalLink href="#" target="_blank" rel="noopener noreferrer">
              Webinars
            </ExternalLink>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Company</FooterTitle>
            <FooterLink to="/about">About Us</FooterLink>
            <FooterLink to="/careers">Careers</FooterLink>
            <FooterLink to="/contact">Contact</FooterLink>
            <ExternalLink href="#" target="_blank" rel="noopener noreferrer">
              Press Kit
            </ExternalLink>
            <ExternalLink href="#" target="_blank" rel="noopener noreferrer">
              Partners
            </ExternalLink>
          </FooterSection>

          <FooterSection>
            <FooterTitle>For Professionals</FooterTitle>
            <FooterLink to="/engineers">Engineer Directory</FooterLink>
            <FooterLink to="/contractors">Contractor Portal</FooterLink>
            <FooterLink to="/enterprise">Enterprise</FooterLink>
            <ExternalLink href="#" target="_blank" rel="noopener noreferrer">
              Material Marketplace
            </ExternalLink>
            <ExternalLink href="#" target="_blank" rel="noopener noreferrer">
              BOQ Generator
            </ExternalLink>
          </FooterSection>
        </FooterGrid>

        <NewsletterSection>
          <NewsletterTitle>Stay Updated</NewsletterTitle>
          <NewsletterDescription>
            Get the latest design trends, tips, and platform updates delivered to your inbox.
          </NewsletterDescription>
          <NewsletterForm onSubmit={handleNewsletterSubmit}>
            <NewsletterInput
              type="email"
              placeholder="Enter your email address"
              required
            />
            <NewsletterButton type="submit">
              Subscribe
            </NewsletterButton>
          </NewsletterForm>
        </NewsletterSection>

        <FooterBottom>
          <Copyright>
            © 2024 ArchGen. All rights reserved.
          </Copyright>
          <LegalLinks>
            <LegalLink to="/privacy">Privacy Policy</LegalLink>
            <LegalLink to="/terms">Terms of Service</LegalLink>
            <LegalLink to="/cookies">Cookie Policy</LegalLink>
            <LegalLink to="/security">Security</LegalLink>
          </LegalLinks>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
