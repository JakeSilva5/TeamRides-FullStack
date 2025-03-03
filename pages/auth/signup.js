import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useStateContext } from '@/context/StateContext';
import { isEmailInUse, register } from '@/backend/Auth';
import Link from 'next/link';
import Navbar from '@/components/Dashboard/Navbar';

const Signup = () => {
  const { setUser } = useStateContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  async function validateEmail() {
    const emailRegex = /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format.');
      return false;
    }
    
    console.log('Checking email...');
    const emailExists = await isEmailInUse(email);
    if (emailExists) {
      setError('Email is already in use.');
      return false;
    }

    return true;
  }

  async function handleSignup() {
    setError('');
    const isValidEmail = await validateEmail();
    if (!isValidEmail) return;

    try {
      await register(email, password, setUser);
      router.push('/');
    } catch (err) {
      console.log('Error Signing Up', err);
      setError(err.message);
    }
  }

  return (
    <>
      <Navbar />
      <Container>
        <FormWrapper>
          <Header>Sign up</Header>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <InputTitle>Email</InputTitle>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <InputTitle>Password</InputTitle>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <MainButton onClick={handleSignup}>Signup</MainButton>
        </FormWrapper>
      </Container>
    </>
  );
};

export default Signup;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #071A2E;
`;

const FormWrapper = styled.div`
  background: #0A1C2E;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.4);
  width: 400px;
  text-align: center;
  border: 3px solid #4CC9F0; /* Blue border */
`;

const Header = styled.h1`
  font-size: 28px;
  font-weight: bold;
  color: white;
  margin-bottom: 25px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 6px;
  border: 2px solid #4CC9F0;
  background: #152A41;
  color: white;
  font-size: 16px;
`;

const InputTitle = styled.label`
  font-size: 16px;
  color: #ccc;
  display: block;
  text-align: left;
  margin-bottom: 6px;
`;

const MainButton = styled.button`
  width: 100%;
  background: #4CC9F0;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  margin-top: 15px;
  transition: background 0.3s;

  &:hover {
    background: #3BA6D2;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 15px;
`;
