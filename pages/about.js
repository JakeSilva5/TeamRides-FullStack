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
        TeamRides simplifies carpooling for club leaders by automatically organizing carpools based on locations, availability, and team needs. The app also aids in route visualization to make plans. Throw out the spreadsheets —TeamRides automates the entire process.
      </Description>

      <HowItWorks>
        <h2>How It Works</h2>
        <StepList>
          <Step>
            <StepNumber>1</StepNumber>
            <StepContent>
              <h3>Create a Plan</h3>
              <p>First, indicate what mode you would like to use. This can always be editted down the line.</p>
            </StepContent>
          </Step>

          <Step>
            <StepNumber>2</StepNumber>
            <StepContent>
              <h3>Enter Plan Details</h3>
              <p>Enter event details, add drivers with their car capacities, and input passengers and addresses.</p>
            </StepContent>
          </Step>

          <Step>
            <StepNumber>3</StepNumber>
            <StepContent>
              <h3>Optimize to Preferences</h3>
              <p>Drag and drop everyone! Some! or none! anyone left will be automatically placed into a car if automation is checked.</p>
            </StepContent>
          </Step>

          <Step>
            <StepNumber>4</StepNumber>
            <StepContent>
              <h3>Finalize Plan</h3>
              <p>Click button to submit your plan, now you can click on your new plan!</p>
            </StepContent>
          </Step>

          <Step>
            <StepNumber>5</StepNumber>
            <StepContent>
              <h3> Analyze </h3>
              <p> You can always edit and optimize to your liking. </p>
            </StepContent>
          </Step>
        </StepList>
      </HowItWorks>

      <CTAButton onClick={() => router.push("/create-plan")}>Get Started</CTAButton>

      <FeatureSection>
        <FeatureCard>
          <h2>Optimized Routes</h2>
          <p>Ensure the most efficient trip paths for every vehicle.</p>
        </FeatureCard>
        <FeatureCard>
          <h2>Automated Ride Planning</h2>
          <p>Instantly organize carpools based on locations and availability.</p>
        </FeatureCard>
        <FeatureCard>
          <h2>Easy Coordination</h2>
          <p>Quickly share trip plans with teammates and drivers.</p>
        </FeatureCard>
      </FeatureSection>

      <Footer />
    </Container>
  );
};

export default About;

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
  font-size: 1.5rem;
  font-weight: bold;
  background: #4CC9F0;
  color: white;
  width: 50px; /* Fixed width */
  height: 50px; /* Fixed height */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0; /* Prevent shrinking */
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
  margin-top: 5px;
  margin-bottom: 10px;

  &:hover {
    background: #3BA6D2;
  }
`;

const FeatureSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  max-width: 1000px;
  padding: 60px 20px;
  margin: 0 auto;
  gap: 30px;

`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 31px;
  border-radius: 15px;
  width: 250px;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, background 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    background: rgba(255, 255, 255, 0.15);
  }

  h2 {
    margin-bottom: 10px;
  }

  p {
    flex-grow: 1;
  }
`;
