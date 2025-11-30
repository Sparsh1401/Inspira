import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import PinterestIcon from '@mui/icons-material/Pinterest';

const Login = () => {
  const { login } = useAuth();

  return (
    <LoginContainer>
      <BackgroundImage />
      <Overlay />
      <LoginCard>
        <LogoWrapper>
          <PinterestIcon style={{ fontSize: '48px', color: '#e60023' }} />
        </LogoWrapper>
        <Title>Welcome to Inspira</Title>
        <Subtitle>Discover and share creative ideas</Subtitle>
        <GoogleButton onClick={login}>
          <GoogleIcon>
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path
                fill="#4285F4"
                d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z"
              />
              <path
                fill="#34A853"
                d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z"
              />
              <path
                fill="#FBBC05"
                d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z"
              />
              <path
                fill="#EA4335"
                d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z"
              />
            </svg>
          </GoogleIcon>
          Continue with Google
        </GoogleButton>
        <Disclaimer>
          By continuing, you agree to Inspira's Terms of Service and Privacy Policy
        </Disclaimer>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
`;

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://images.unsplash.com/photo-1617142108362-7362d64b2238?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80');
  background-size: cover;
  background-position: center;
  filter: blur(8px);
  transform: scale(1.1);
  z-index: -2;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: -1;
`;

const LoginCard = styled.div`
  background: white;
  padding: 40px 30px;
  border-radius: 32px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
  width: 90%;
  z-index: 1;
`;

const LogoWrapper = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
  letter-spacing: -1px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #333;
  margin-bottom: 30px;
  font-weight: 400;
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px 20px;
  background: white;
  border: 1px solid #dadce0;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 500;
  color: #3c4043;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;

  &:hover {
    background-color: #f7f8f8;
    border-color: #d2e3fc;
  }
`;

const GoogleIcon = styled.div`
  display: flex;
  align-items: center;
  margin-right: 12px;
`;

const Disclaimer = styled.p`
  margin-top: 24px;
  font-size: 11px;
  color: #767676;
  line-height: 1.5;
`;
