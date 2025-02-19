import React from 'react';
import styled from 'styled-components';
import Link from 'next/link'
import { logOut } from '@/backend/Auth';
import { useStateContext } from '@/context/StateContext';
import Home from '@/components/Dashboard/Home'
const Navbar = () => {
  const { setUser } = useStateContext()

  return (
    <Nav>
      <Logo onClick={() => logOut(setUser)} href="/">CMPSC 263</Logo>
      <Home></Home>
      <NavLinks>
        <ButtonLink href="/auth/signup">Sign Up</ButtonLink>
        <ButtonLink href="/auth/login">Login</ButtonLink>
      </NavLinks>
    </Nav>
  );
};

const Nav = styled.nav`

`;

const Logo = styled(Link)`

`;

const NavLinks = styled.div`

`;

const ButtonLink = styled(Link)`

`;

export default Navbar;
