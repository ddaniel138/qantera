import React, { useState } from 'react';
import styled from 'styled-components';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Header = styled.header`
  width: 100%;
  background-color: #0B0B0C;
  border-bottom: 1px solid rgba(63, 63, 70, 0.4);
  padding: 16px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 50;

  @media (max-width: 768px) {
    padding: 16px 20px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
`;

const Logo = styled.span`
  font-family: var(--font-dm-sans), sans-serif;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.02em;
  background: linear-gradient(186.83deg, #AECFFF 18.44%, #052742 94.96%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  user-select: none;
`;

const NavLinks = styled.nav<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 24px;

  @media (max-width: 768px) {
    display: ${props => (props.$isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #0B0B0C;
    border-bottom: 1px solid rgba(63, 63, 70, 0.4);
    padding: 24px;
    gap: 20px;
    align-items: flex-start;
  }
`;

const NavLink = styled.a<{ $active?: boolean }>`
  font-family: var(--font-dm-sans), sans-serif;
  font-size: 14px;
  font-weight: ${props => (props.$active ? '600' : '500')};
  color: ${props => (props.$active ? 'rgba(196, 230, 255, 1)' : '#a1a1aa')};
  text-decoration: none;
  position: relative;
  transition: color 0.2s ease;

  &:hover {
    color: rgba(196, 230, 255, 0.8);
  }

  ${props => props.$active && `
    &::after {
      content: '';
      position: absolute;
      bottom: -21px;
      left: 0;
      right: 0;
      height: 2px;
      background-color: rgba(196, 230, 255, 1);
    }
  `}

  @media (max-width: 768px) {
    width: 100%;
    &::after { display: none; }
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StyledButton = styled.button`
  background-color: rgba(196, 230, 255, 1);
  color: #0B0B0C;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 480px) {
    padding: 8px 14px;
    font-size: 13px;
  }
`;

const ChainButton = styled.button`
  background-color: #27272a;
  color: #e4e4e7;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #3f3f46;
  }

  @media (max-width: 480px) {
    display: none;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 22px;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Header>
                <Logo>ArcBridge</Logo>
                <NavLinks $isOpen={isOpen}>
                    <NavLink href="#" $active>Bridge</NavLink>
                </NavLinks>

            <RightSection>
                <ConnectButton.Custom>
                    {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
                        const connected = mounted && account && chain;
                        if (!connected) {
                            return <StyledButton onClick={openConnectModal}>Connect Wallet</StyledButton>;
                        }
                        if (chain.unsupported) {
                            return (
                                <StyledButton onClick={openChainModal} style={{ backgroundColor: '#ef4444', color: '#fff' }}>
                                    Wrong network
                                </StyledButton>
                            );
                        }
                        return (
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <ChainButton onClick={openChainModal}>{chain.name}</ChainButton>
                                <StyledButton onClick={openAccountModal} style={{ fontFamily: 'var(--font-space-mono)' }}>
                                    {account.displayName}
                                </StyledButton>
                            </div>
                        );
                    }}
                </ConnectButton.Custom>
                <MenuButton onClick={() => setIsOpen(!isOpen)}>☰</MenuButton>
            </RightSection>
        </Header>
    );
}