import React from 'react';
import styled from 'styled-components';

const Logo = () => {
  return (
    <LogoWrapper>
      <svg viewBox="0 0 100 100" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" fill="#b91d1d" />
        <path d="M35 25 H65 C75 25 80 35 80 50 C80 65 75 75 65 75 H35 V25 Z M45 35 V65 H60 C68 65 70 60 70 50 C70 40 68 35 60 35 H45 Z" fill="white" />
        <path d="M30 20 L40 20 L35 80 L25 80 Z" fill="white" />
      </svg>
    </LogoWrapper>
  );
};

export default Logo;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;
