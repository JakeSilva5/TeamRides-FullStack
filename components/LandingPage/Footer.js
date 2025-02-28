import React from 'react';
import styled from 'styled-components';

const Footer = () => {
  return (
    <FooterSection>
      <FooterContainer>
        <Text>
          Developed by <Bold>Jake Silva</Bold> | CMPSC 263 Project
        </Text>
        <Text>© {new Date().getFullYear()} CMPSC 263</Text>
      </FooterContainer>
    </FooterSection>
  );
};

export default Footer;

const FooterSection = styled.footer`
  background: #0A1C2E;
  color: white;
  text-align: center;
  padding: 15px 0;
  position: relative;
  width: 100%;
`;

const FooterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Text = styled.p`
  font-size: 14px;
  color: #ccc;
  margin: 5px 0;
`;

const Bold = styled.span`
  font-weight: bold;
  color: white;
`;

const FooterLink = styled.a`
  color: #4CC9F0;
  text-decoration: none;
  font-weight: bold;
  &:hover {
    text-decoration: underline;
  }
`;