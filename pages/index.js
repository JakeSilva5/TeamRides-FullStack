import Hero from "@/components/LandingPage/Hero"
import { styled } from 'styled-components'
import Navbar from "@/components/Dashboard/Navbar"
import Footer from "@/components/LandingPage/Footer"


export default function Home() {
  return (
    <>
      
      <Hero />
      <FeatureSection>
       <FeatureCard>
         <Emoji>🚗</Emoji>
         <h3>Automated Ride Planning</h3>
         <p>Instantly assigns passengers to drivers based on capacity & location.</p>
       </FeatureCard>


       <FeatureCard>
         <Emoji>📍</Emoji>
         <h3>Optimized Routes</h3>
         <p>Uses 3 Google API for extra functionality in optimizing plans.</p>
       </FeatureCard>

       <FeatureCard>
         <Emoji>🔄</Emoji>
         <h3>Live Updates</h3>
         <p>Easily make changes without having to start over. Including a Manual Adjustment mode.</p>
       </FeatureCard>

       <FeatureCard>
         <Emoji>📥</Emoji>
         <h3>Drag & Drop Adjustments</h3>
         <p>Club leaders can fine-tune assignments with an interactive interface.</p>
       </FeatureCard>

     </FeatureSection>
      <Footer />
    </>
  );
}

const FeatureSection = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 30px; 
  margin-top: 80px; 
  margin-bottom: 80px; 
  padding: 0 10%; 
`;

const FeatureCard = styled.div`
  flex: 1 1 280px; 
  max-width: 250px; 
  background: rgba(255, 255, 255, 0.1);
  padding: 25px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, background 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.15);
  }

  h3 {
    margin-bottom: 12px;
    font-size: 1.3rem;
  }

  p {
    font-size: 1rem;
    opacity: 0.85;
  }
`;

const Emoji = styled.span`
 font-size: 1.5rem;
 display: block;
 margin-bottom: 10px;
`;