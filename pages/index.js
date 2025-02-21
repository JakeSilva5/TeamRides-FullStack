import Hero from "@/components/LandingPage/Hero"
import { styled } from 'styled-components'
import Navbar from "@/components/Dashboard/Navbar"
import Footer from "@/components/LandingPage/Footer"


export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
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
    </>
  );
}


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
  padding: 30px;
  border-radius: 15px;
  width: 300px;
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

