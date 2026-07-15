import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { getBatchManualMintStatus } from '@/utils/arc-bridge-sdk.mjs';

export interface MintStatusDetails {
    hash: string;
    showMintButton: boolean;
    canMint: boolean;
    blockReason: string | null;
    blockReasonLabel: string | null;
    phase: 'waiting_attestation' | 'manual_mint_ready' | 'relay_done';
    mintAmountUsdc: number | null;
    arcGasBalanceUsdc: number | null;
    estimatedGasUsdc: number | null;
}

const STORAGE_KEY = 'arc_bridge_transactions';
const MINT_STORAGE_KEY = 'arc_mint_statuses';
const EVENT_NAME = 'arc_tx_updated';

export function useArcMintTracker() {
    const { address, isConnected } = useAccount();
    const [mintStatuses, setMintStatuses] = useState<Record<string, MintStatusDetails>>({});
    const [loading, setLoading] = useState<boolean>(false);

    const loadMintStatuses = useCallback(() => {
        if (!isConnected || !address || typeof window === 'undefined') return;
        const cached = localStorage.getItem(MINT_STORAGE_KEY);
        if (cached) {
            try {
                setMintStatuses(JSON.parse(cached));
            } catch (e) {
                console.error(e);
            }
        }
    }, [address, isConnected]);

    const refreshMintStatus = useCallback(async () => {
        if (!isConnected || !address || typeof window === 'undefined') return;
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return;

        try {
            setLoading(true);
            const allTxs = JSON.parse(stored);
            const userTxs = allTxs.filter((tx: any) => tx.fromAddress.toLowerCase() === address.toLowerCase());
            if (userTxs.length === 0) return;

            const burnTxHashes = userTxs.map((tx: any) => tx.hash);
            const batchResults = await getBatchManualMintStatus(burnTxHashes, { recipient: address });

            const nextMintMap: Record<string, MintStatusDetails> = {};
            batchResults.forEach((res: any) => {
                if (res) {
                    nextMintMap[res.hash] = res as MintStatusDetails;
                }
            });
            
            localStorage.setItem(MINT_STORAGE_KEY, JSON.stringify(nextMintMap));
            setMintStatuses(nextMintMap);
        } catch (error) {
            console.error('Error manual refreshing mint status:', error);
        } finally {
            setLoading(false);
        }
    }, [address, isConnected]);

    useEffect(() => {
        loadMintStatuses();
        window.addEventListener(EVENT_NAME, loadMintStatuses);
        window.addEventListener('storage', loadMintStatuses);
        return () => {
            window.removeEventListener(EVENT_NAME, loadMintStatuses);
            window.removeEventListener('storage', loadMintStatuses);
        };
    }, [loadMintStatuses]);

    return {
        mintStatuses,
        refreshMintStatus,
        loading
    };
}