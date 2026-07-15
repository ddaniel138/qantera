import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { fetchBridgeStatus, getBatchManualMintStatus, ARC_BRIDGE } from '@/utils/arc-bridge-sdk.mjs';

export interface BridgeTxDetails {
  hash: string;
  fromAddress: string;
  fromChainId: number;
  toChainId: number;
  amount: string;
  tokenSymbol: string;
  addedTime: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  circleStatus: string;
  pollIndex: number;
  pollMax: number;
}

const STORAGE_KEY = 'arc_bridge_transactions';
const MINT_STORAGE_KEY = 'arc_mint_statuses';
const EVENT_NAME = 'arc_tx_updated';

let globalPollingTimer: NodeJS.Timeout | null = null;
let isPollingActive = false;
let currentlyVisibleHashes: string[] = [];

export function updateVisibleHashesInWorker(hashes: string[]) {
  currentlyVisibleHashes = hashes.map(h => h.toLowerCase());
}

async function startBackgroundWorker(recipientAddress: string) {
  if (isPollingActive) return;
  isPollingActive = true;

  globalPollingTimer = setInterval(async () => {
    if (typeof window === 'undefined') return;
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      stopBackgroundWorker();
      return;
    }

    let allTxs: BridgeTxDetails[] = JSON.parse(stored);
    
    const activeUserTxs = allTxs.filter(
      (tx) => tx.fromAddress.toLowerCase() === recipientAddress.toLowerCase()
    );

    const visibleUserTxs = activeUserTxs.filter(tx => 
      currentlyVisibleHashes.includes(tx.hash.toLowerCase())
    );

    if (visibleUserTxs.length === 0) return;

    try {
      const visibleHashes = visibleUserTxs.map(tx => tx.hash);
      const batchMintRes = await getBatchManualMintStatus(visibleHashes, { recipient: recipientAddress });
      
      const storedMint = localStorage.getItem(MINT_STORAGE_KEY);
      const mintMap: Record<string, any> = storedMint ? JSON.parse(storedMint) : {};
      
      batchMintRes.forEach((res: any) => {
        if (res) mintMap[res.hash] = res;
      });
      localStorage.setItem(MINT_STORAGE_KEY, JSON.stringify(mintMap));
    } catch (err) {
      console.error("Batch mint polling error:", err);
    }

    const pendingVisibleTxs = visibleUserTxs.filter((tx) => tx.status === 'PENDING');
    if (pendingVisibleTxs.length === 0) {
      window.dispatchEvent(new Event(EVENT_NAME));
      return; 
    }

    let dynamicChanged = false;

    allTxs = await Promise.all(
      allTxs.map(async (tx) => {
        if (tx.status !== 'PENDING' || tx.circleStatus === 'complete') return tx;
        if (tx.fromAddress.toLowerCase() !== recipientAddress.toLowerCase()) return tx;
        if (!currentlyVisibleHashes.includes(tx.hash.toLowerCase())) return tx;

        const nextPollIndex = tx.pollIndex + 1;
        try {
          const statusRes = await fetchBridgeStatus(tx.hash, { poll: nextPollIndex, pollMax: tx.pollMax });
          const rawCircleStatus = statusRes?.iris?.status || 'pending_confirmations';
          const isDone = statusRes?.pending?.done || rawCircleStatus === 'complete';
          const nextAction = statusRes?.pending?.nextAction;

          dynamicChanged = true;
          if (isDone || rawCircleStatus === 'complete') {
            return { ...tx, pollIndex: nextPollIndex, status: 'SUCCESS', circleStatus: 'complete' };
          }
          if (nextAction === 'FAILED') {
            return { ...tx, pollIndex: nextPollIndex, status: 'FAILED', circleStatus: rawCircleStatus };
          }

          return { ...tx, pollIndex: nextPollIndex, circleStatus: rawCircleStatus };
        } catch (e) {
          return tx;
        }
      })
    );

    if (dynamicChanged) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allTxs));
    }
    
    window.dispatchEvent(new Event(EVENT_NAME));
  }, 20000);
}

function stopBackgroundWorker() {
  if (globalPollingTimer) {
    clearInterval(globalPollingTimer);
    globalPollingTimer = null;
  }
  isPollingActive = false;
}

export function useBridgeTransactions() {
  const { address, chainId } = useAccount();
  const [transactions, setTransactions] = useState<BridgeTxDetails[]>([]);

  const loadTransactions = useCallback(() => {
    if (typeof window === 'undefined' || !address) return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const allTxs: BridgeTxDetails[] = JSON.parse(stored);
        const userTxs = allTxs.filter((tx) => tx.fromAddress.toLowerCase() === address.toLowerCase());
        setTransactions(userTxs);

        startBackgroundWorker(address.toLowerCase());
      } catch (e) {
        console.error(e);
      }
    } else {
      setTransactions([]);
    }
  }, [address]);

  useEffect(() => {
    loadTransactions();
    window.addEventListener(EVENT_NAME, loadTransactions);
    window.addEventListener('storage', loadTransactions);
    return () => {
      window.removeEventListener(EVENT_NAME, loadTransactions);
      window.removeEventListener('storage', loadTransactions);
    };
  }, [loadTransactions]);

  const addBridgeTransaction = useCallback(async (hash: string, data: { toChainId: number; amount: string; tokenSymbol: string }) => {
    if (!address || !chainId || !hash) return;

    const newTx: BridgeTxDetails = {
      hash,
      fromAddress: address.toLowerCase(),
      fromChainId: chainId,
      toChainId: data.toChainId,
      amount: data.amount,
      tokenSymbol: data.tokenSymbol,
      addedTime: Date.now(),
      status: 'PENDING',
      circleStatus: 'pending_confirmations',
      pollIndex: 1,
      pollMax: ARC_BRIDGE.pollMax || 600,
    };

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      let allTxs: BridgeTxDetails[] = stored ? JSON.parse(stored) : [];
      allTxs = [newTx, ...allTxs.filter(t => t.hash.toLowerCase() !== hash.toLowerCase())];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allTxs));
      
      window.dispatchEvent(new Event(EVENT_NAME));
      startBackgroundWorker(address.toLowerCase());
    }
  }, [address, chainId]);

  return {
    transactions,
    addBridgeTransaction,
    hasPending: transactions.some(tx => tx.status === 'PENDING'),
    pendingCount: transactions.filter(tx => tx.status === 'PENDING').length,
  };
}