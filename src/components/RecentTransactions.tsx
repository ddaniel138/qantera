/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { useAccount, useSwitchChain } from 'wagmi';
import { useBridgeTransactions, BridgeTxDetails, updateVisibleHashesInWorker } from '@/hooks/useBridgeTransactions';
import { MintStatusDetails, useArcMintTracker } from '@/hooks/useArcMintTracker';
import { buildManualMintTx, ARC_BRIDGE } from '@/utils/arc-bridge-sdk.mjs';
import { BrowserProvider } from 'ethers';

const Container = styled.div` width: 100%; `;
const HeaderRow = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 0 4px; `;
const Title = styled.h3` font-family: var(--font-space-mono), monospace; font-size: 12px; color: rgba(226, 226, 226, 1); text-transform: uppercase; letter-spacing: 0.05em; margin: 0; `;
const ViewExplorer = styled.a` font-family: var(--font-space-mono), monospace; font-size: 12px; color: rgba(196, 230, 255, 1); text-decoration: none; &:hover { color: #A1A1AA; text-decoration: underline; } `;
const ListBox = styled.div` display: flex; flex-direction: column; background: #131315; border: 1px solid #232326; border-radius: 16px; max-height: 750px; overflow-y: auto; &::-webkit-scrollbar { width: 2px; } &::-webkit-scrollbar-thumb { background: #2A2A2D; border-radius: 4px; } `;
const TxItem = styled.div` display: flex; flex-direction: column; gap: 4px; padding: 16px ; border-bottom: 1px solid rgba(39, 39, 42, 0.4); &:last-child { border-bottom: none; } `;
const FlexRow = styled.div` display: flex; justify-content: space-between; align-items: center; `;
const StatusWrapper = styled.div` display: flex; align-items: center; gap: 6px; `;

const Dot = styled.span<{ $status: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${props => {
    if (props.$status === 'SUCCESS') return '#22C55E';
    if (props.$status === 'FAILED') return '#EF4444';
    return '#C4E6FF';
  }};
`;

const StatusText = styled.span<{ $status: string }>`
  font-family: var(--font-space-mono), monospace;
  font-size: 10px;
  font-weight: 700;
  color: ${props => {
    if (props.$status === 'SUCCESS') return '#22C55E';
    if (props.$status === 'FAILED') return '#EF4444';
    return '#C4E6FF';
  }};
`;

const TimeText = styled.span` font-family: var(--font-space-mono), monospace; font-size: 11px; color: #C0C7CE; `;
const RouteText = styled.span` font-family: var(--font-dm-sans), sans-serif; font-size: 14px; font-weight: 500; color: #E2E2E2; `;
const AmountText = styled.span` font-family: var(--font-space-mono), monospace; font-size: 12px; font-weight: 700; color: #E2E2E2; `;
const HashText = styled.span` font-family: var(--font-space-mono), monospace; font-size: 10px; color: #71717A; margin-top: 2px; `;
const EmptyState = styled.div` font-family: var(--font-dm-sans), sans-serif; font-size: 13px; color: #71717A; text-align: center; padding: 40px 0; `;

const ReasonMessage = styled.div`
  font-family: var(--font-space-mono), monospace;
  font-size: 10px;
  color: #F59E0B;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const MintButton = styled.button`
  font-family: var(--font-dm-sans), sans-serif;
  font-size: 8px;
  font-weight: 700;
  color: #131315;
  background-color: #4DFB8D;
  border: none;
  border-radius: 4px;
  padding: 6px 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: #16A34A;
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #27272A;
    color: #71717A;
    cursor: not-allowed;
  }
`;

const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M7.10208 5.25H0V4.08333H7.10208L3.83542 0.816667L4.66667 0L9.33333 4.66667L4.66667 9.33333L3.83542 8.51667L7.10208 5.25Z" fill={props.fill || "#E2E2E2"} />
  </svg>
);

function formatTimeAgo(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return new Date(timestamp).toLocaleDateString();
}

function getChainName(chainId: number): string {
  if (chainId === 8453) return 'Base';
  if (chainId === 5042) return 'Arc';
  return `Chain (${chainId})`;
}

function getEnglishReasonLabel(reason: string | null): string {
  if (!reason) return '';
  switch (reason) {
    case 'minter_cap':
      return 'Minter capacity limit reached. Waiting for liquidity pool refill...';
    case 'waiting_attestation':
      return 'Waiting for network attestation confirmation from Circle...';
    case 'insufficient_gas':
      return 'Insufficient ARC gas balance to execute transaction.';
    default:
      return '';
  }
}

interface ObservedRowProps {
  tx: BridgeTxDetails;
  onVisible: (hash: string, visible: boolean) => void;
  children: React.ReactNode;
}

const ObservedTxRow = ({ tx, onVisible, children }: ObservedRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        onVisible(tx.hash, entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    if (rowRef.current) observer.observe(rowRef.current);
    return () => observer.disconnect();
  }, [tx.hash, onVisible]);

  return <div ref={rowRef}>{children}</div>;
};


export default function RecentTransactions() {
  const { address, isConnected, chainId } = useAccount();
  const { transactions } = useBridgeTransactions();
  const { mintStatuses, refreshMintStatus } = useArcMintTracker();
  const { switchChainAsync } = useSwitchChain();
  const [mintLoading, setMintLoading] = useState<Record<string, boolean>>({});
  const [, setTicker] = useState<number>(0);

  const [visibleMap, setVisibleMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setTicker(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const visibleHashes = Object.keys(visibleMap).filter(hash => visibleMap[hash]);
    updateVisibleHashesInWorker(visibleHashes);
  }, [visibleMap]);

  const handleVisibilityChange = useCallback((hash: string, isVisible: boolean) => {
    setVisibleMap(prev => {
      if (prev[hash] === isVisible) return prev;
      return { ...prev, [hash]: isVisible };
    });
  }, []);

  const displayedTxs = transactions.slice(0, 10);

  const handleManualMint = async (txHash: string) => {
    if (!address) return;

    try {
      setMintLoading(prev => ({ ...prev, [txHash]: true }));
      await refreshMintStatus();

      const currentTxMintState = mintStatuses[txHash];
      if (currentTxMintState && currentTxMintState.phase === 'relay_done') return;
      if (currentTxMintState && !currentTxMintState.canMint) return;

      if (chainId !== ARC_BRIDGE.arcChainId) {
        try {
          await switchChainAsync({ chainId: ARC_BRIDGE.arcChainId });
        } catch (switchError) {
          return;
        }
      }

      const txData = await buildManualMintTx(txHash, { recipient: address });

      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const provider = new BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();

        const sentTx = await signer.sendTransaction({
          to: txData.to,
          data: txData.data,
          value: txData.value,
          gasLimit: txData.gasLimit
        });

        await sentTx.wait();
        alert("USDC successfully minted on Arc network!");
        window.dispatchEvent(new Event('arc_tx_updated'));
      }
    } catch (error: any) {
      console.error("Manual mint process failed:", error);
      alert(error?.message || "Manual minting execution failed.");
    } finally {
      setMintLoading(prev => ({ ...prev, [txHash]: false }));
    }
  };

  const renderStatusLabel = (tx: BridgeTxDetails, mintState?: MintStatusDetails) => {
    if (mintState?.phase === 'relay_done') return 'SUCCESS';
    if (tx.status === 'SUCCESS') return 'COMPLETED';
    if (tx.status === 'FAILED') return 'FAILED';
  
    const totalElapsedSeconds = Math.floor((Date.now() - tx.addedTime) / 1000);
    const validSeconds = totalElapsedSeconds < 0 ? 0 : totalElapsedSeconds;
    const currentLoopSeconds = (validSeconds % 600) + 1;
  
    return `PENDING (${currentLoopSeconds}/600)`;
  };

  return (
    <Container>
      <HeaderRow>
        <Title>// Recent Transactions</Title>
        <ViewExplorer href="https://basescan.org/" target="_blank">View Explorer</ViewExplorer>
      </HeaderRow>

      <ListBox>
        {!isConnected ? (
          <EmptyState>Please connect your wallet to view transactions</EmptyState>
        ) : displayedTxs.length > 0 ? (
          displayedTxs.map((tx: BridgeTxDetails) => {
            const mintState = mintStatuses[tx.hash];
            const computedStatus = (tx.status === 'SUCCESS' || mintState?.phase === 'relay_done') ? 'SUCCESS' : tx.status;
            const isPendingMint = mintState?.showMintButton || mintState?.phase === 'manual_mint_ready';
            const isButtonDisabled = !mintState?.canMint || mintLoading[tx.hash];
            const englishReason = getEnglishReasonLabel(mintState?.blockReason);

            return (
              <ObservedTxRow key={tx.hash} tx={tx} onVisible={handleVisibilityChange}>
                <TxItem>
                  <FlexRow>
                    <StatusWrapper>
                      <Dot $status={computedStatus} />
                      <StatusText $status={computedStatus}>
                        {renderStatusLabel(tx, mintState)}
                      </StatusText>
                    </StatusWrapper>
                    <TimeText>{formatTimeAgo(tx.addedTime)}</TimeText>
                  </FlexRow>

                  <FlexRow style={{ marginTop: '2px' }}>
                    <FlexRow style={{ gap: '6px', alignItems: 'center' }}>
                      <RouteText>{getChainName(tx.fromChainId)}</RouteText>
                      <ArrowRightIcon fill="#71717A" />
                      <RouteText>{getChainName(tx.toChainId)}</RouteText>
                    </FlexRow>
                    <AmountText>
                      {parseFloat(tx.amount).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 5
                      })} {tx.tokenSymbol}
                    </AmountText>
                  </FlexRow>

                  <FlexRow style={{ marginTop: '4px', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <HashText as="a" href={`https://basescan.org/tx/${tx.hash}`} target="_blank">
                        {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                      </HashText>
                      {mintState?.blockReason && (
                        <ReasonMessage>
                          {englishReason}
                        </ReasonMessage>
                      )}
                    </div>

                    {isPendingMint && (
                      <MintButton
                        disabled={isButtonDisabled}
                        onClick={() => handleManualMint(tx.hash)}
                        title={englishReason || undefined}
                      >
                        {mintLoading[tx.hash] ? 'Minting...' : 'Mint'}
                      </MintButton>
                    )}
                  </FlexRow>
                </TxItem>
              </ObservedTxRow>
            );
          })
        ) : (
          <EmptyState>No recent transactions</EmptyState>
        )}
      </ListBox>
    </Container>
  );
}