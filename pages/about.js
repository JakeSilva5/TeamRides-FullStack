import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import Footer from "../components/LandingPage/Footer"; // Import Footer properly

const About = () => {
  const router = useRouter();

  return (
    <Container>
      <Title>About TeamRides</Title>
      <Description>
        TeamRides simplifies carpooling for club leaders by automatically organizing carpools based on locations, availability, and team needs. No more spreadsheets or manual assignments—TeamRides automates the entire process.
      </Description>

      {/* Features Section */}
      <FeatureSection>
        <FeatureCard>
          <Emoji>🚗</Emoji>
          <h3>Automated Ride Planning</h3>
          <p>Instantly assigns passengers to drivers based on capacity & location.</p>
        </FeatureCard>

        <FeatureCard>
          <Emoji>📍</Emoji>
          <h3>Optimized Routes</h3>
          <p>Uses Google Maps API to find the best possible routes for drivers.</p>
        </FeatureCard>

        <FeatureCard>
          <Emoji>📥</Emoji>
          <h3>Drag & Drop Adjustments</h3>
          <p>Club leaders can fine-tune assignments with an interactive interface.</p>
        </FeatureCard>

        <FeatureCard>
          <Emoji>🔄</Emoji>
          <h3>Live Updates</h3>
          <p>Easily make changes without having to start over.</p>
        </FeatureCard>
      </FeatureSection>

      {/* How It Works Section */}
      <HowItWorks>
        <h2>How It Works</h2>
        <StepList>
          <Step>
            <StepNumber>1</StepNumber>
            <StepContent>
              <h3>Create a Plan</h3>
              <p>Enter event details, add drivers with their car capacities, and input passengers and addresses.</p>
            </StepContent>
          </Step>

          <Step>
            <StepNumber>2</StepNumber>
            <StepContent>
              <h3>Assign Passengers</h3>
              <p>Automatically assign passengers based on locations and capacity, with manual adjustments available.</p>
            </StepContent>
          </Step>

          <Step>
            <StepNumber>3</StepNumber>
            <StepContent>
              <h3>Optimize & Finalize</h3>
              <p>Fine-tune car assignments with drag and drop efficiency, ensure all passengers have a ride with easy visualization, and finalize your travel plan.</p>
            </StepContent>
          </Step>
        </StepList>
      </HowItWorks>

      {/* CTA Section */}
      <CTAButton onClick={() => router.push("/create-plan")}>Get Started</CTAButton>

      {/* Developed By Section */}
      <DevelopedBy>
        Developed by <strong>Jake Silva</strong> | CMPSC 263 Project
      </DevelopedBy>

      {/* Footer */}
      <Footer />
    </Container>
  );
};

export default About;

/* 🔹 Styled Components */
const Container = styled.div`
  width: 80%;
  margin: auto;
  padding: 50px 20px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 1.2rem;
  margin-bottom: 50px;
  opacity: 0.8;
  max-width: 750px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.5;
`;

/* Features Section */
const FeatureSection = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 50px;
`;

const FeatureCard = styled.div`
  flex: 1 1 calc(33.33% - 20px);
  max-width: 300px;
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, background 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.15);
  }

  h3 {
    margin-bottom: 10px;
    font-size: 1.2rem;
  }

  p {
    font-size: 1rem;
    opacity: 0.8;
  }
`;

const Emoji = styled.span`
  font-size: 1.5rem;
  display: block;
  margin-bottom: 10px;
`;

/* How It Works Section */
const HowItWorks = styled.div`
  margin: 50px auto;
  max-width: 800px;
  text-align: center;

  h2 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 20px;
  }
`;

const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 10px;
`;

const StepNumber = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  background: #4CC9F0;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StepContent = styled.div`
  text-align: left;

  h3 {
    font-size: 1.2rem;
    margin-bottom: 5px;
  }

  p {
    font-size: 1rem;
    opacity: 0.8;
  }
`;

/* CTA Button */
const CTAButton = styled.button`
  background: #4CC9F0;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
  border: none;
  margin-top: 30px;

  &:hover {
    background: #3BA6D2;
  }
`;

/* Developed By Section */
const DevelopedBy = styled.p`
  margin-top: 50px;
  font-size: 1rem;
  opacity: 0.8;
`;

