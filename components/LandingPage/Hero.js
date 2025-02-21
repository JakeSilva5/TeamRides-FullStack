import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';

const Hero = () => {
  const router = useRouter();
  return (
    <HeroSection>
      <Overlay />
      <HeroContent>
        <Header>Effortless <Highlight>Automatation</Highlight> for <Highlight>your Club's</Highlight> Car Assignments </Header>
        <SubHeader>
          Stop wasting time manually making car assignments! Just type out your members once and get optimized plans instantly.
        </SubHeader>
        <CTAButton onClick={() => router.push('/create-plan')}>
          Start a Plan ➜
        </CTAButton>
      </HeroContent>
    </HeroSection>
  );
};


const HeroSection = styled.section`
  width: 100%;
  height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  background: linear-gradient(-45deg, #245e90, #3b76b2, #245e90, #3b76b2);
  background-size: 300% 300%;
  animation: gradientBG 7s linear infinite;

  @keyframes gradientBG {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  
  background: rgba(10, 37, 64, 0.45); 
  overflow: hidden;

  &::before, &::after {
    content: "";
    position: absolute;
    width: 220px;
    height: 220px;
    background: rgba(76, 201, 240, 0.45); /* Brighter, more opaque */
    border-radius: 50%;
    filter: blur(90px);
    animation: float 14s infinite ease-in-out;
  }

  &::before {
    top: 15%;
    left: 10%;
  }
  &::after {
    bottom: 15%;
    right: 10%;
    animation-delay: 4s;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-25px); }
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
`;

const Header = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  color: white;
  text-transform: uppercase;
  margin-bottom: 18px;
`;

const Highlight = styled.span`
  color: #4CC9F0;
`;

const SubHeader = styled.p`
  font-size: 1.2rem;
  font-weight: 400;
  color: white;
  margin-bottom: 30px;
`;

const CTAButton = styled.button`
  background: #4CC9F0;
  color: white;
  padding: 14px 25px;
  font-size: 1.2rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: 0.3s;
  box-shadow: 0px 4px 12px rgba(76, 201, 240, 0.4);
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background: #3BA6D2;
    box-shadow: 0px 6px 15px rgba(76, 201, 240, 0.6);
    transform: translateY(-3px);
  }
`;

export default Hero;
