import React from 'react';
import styled from 'styled-components';

const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
  margin-bottom: 24px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
`;

const InfoLabel = styled.span`
  font-family: var(--font-space-mono), monospace;
  color: #C0C7CE;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const InfoValue = styled.span<{ $green?: boolean }>`
  font-family: var(--font-space-mono), monospace;
  color: ${props => (props.$green ? '#4ADE80' : '#E2E2E2')};
  font-weight: 500;
  letter-spacing: -0.01em;
`;

interface DataPanelProps {
    networkFee?: string;
    minterCap?: string;
    estimatedTime?: string;
    router?: string;
  }

export default function DataPanel({ networkFee, minterCap, estimatedTime, router }: DataPanelProps) {
    return (
      <PanelContainer>
        <InfoRow>
          <InfoLabel>Network Fee</InfoLabel>
          <InfoValue $green>{networkFee}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>Circle Minter Cap</InfoLabel>
          <InfoValue $green>{minterCap}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>Estimated Time</InfoLabel>
          <InfoValue>{estimatedTime}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>Router</InfoLabel>
          <InfoValue>{router}</InfoValue>
        </InfoRow>
      </PanelContainer>
    );
  }