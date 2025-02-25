import React from 'react';
import styled from 'styled-components';
import Link from 'next/link'
import { useRouter } from 'next/router';
import { useStateContext } from '@/context/StateContext';
import Home from '@/components/Dashboard/Home'

const Navbar = () => {
  const { user, setUser } = useStateContext();
  const router = useRouter();
  
  return (
    <Nav>
      <LeftSection>
        <Logo onClick={() => router.push('/')}>TeamRides</Logo>
      </LeftSection>

      <CenterSection>
        <NavLink href="/create-plan">Create Plan</NavLink>
        <NavLink href="/my-plans">My Plans</NavLink>
        <NavLink href="/about">About</NavLink>
      </CenterSection>

      <RightSection>
        {!user ? (
          <>
            <Button onClick={() => router.push('/auth/signup')}>Sign Up</Button>
            <Button onClick={() => router.push('/auth/login')}>Login</Button>
          </>
        ) : null}
      </RightSection>
    </Nav>
  );
};

export default Navbar;


const Nav = styled.nav`
  background: #0A1C2E;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 40px;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
`;

const CenterSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 40px;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
`;

const NavLink = styled(Link)`
  font-size: 1rem;
  color: white;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #4CC9F0;
  }
`;

const Button = styled.button`
  background: #4CC9F0;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #3BA6D2;
  }
`;
