import { useState, useEffect } from 'react';
import { getForwardQuote } from '@/utils/arc-bridge-sdk.mjs';

interface MinterCapData {
  displayUsdc: number;
  perMessageUsdc: number;
  maxSingleBridgeUsdc: number;
}

export function useBridgePolling(amountUsdc: string, intervalMs: number = 40000) {
  const [minterCap, setMinterCap] = useState<MinterCapData | null>(null);
  const [networkFeeUsdc, setNetworkFeeUsdc] = useState<number>(0.0165);
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(15);
  const [canBridge, setCanBridge] = useState<boolean>(false);
  const [blockReason, setBlockReason] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const parsedAmount = parseFloat(amountUsdc) || 0;

  useEffect(() => {
    if (parsedAmount <= 0) {
      setMinterCap(null);
      setCanBridge(false);
      setBlockReason(null);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchQuoteData = async (showLoadingState: boolean) => {
      if (showLoadingState && isMounted) setLoading(true);
      try {
        const quote = await getForwardQuote(parsedAmount);

        if (isMounted) {
          if (quote.circleMinterCap) {
            setMinterCap(quote.circleMinterCap);
          }
          setNetworkFeeUsdc(quote.networkFeeUsdc);
          setEstimatedMinutes(quote.estimatedMinutes || 15);
          
          if (parsedAmount <= quote.networkFeeUsdc) {
            setCanBridge(false);
            setBlockReason(`Amount must be greater than the network fee (${quote.networkFeeUsdc} USDC).`);
          } else {
            setCanBridge(quote.canBridge);
            setBlockReason(quote.blockReason);
          }
        }
      } catch (err) {
        console.error("Error updating Bridge Quote Polling:", err);
      } finally {
        if (showLoadingState && isMounted) setLoading(false);
      }
    };

    fetchQuoteData(true);

    const interval = setInterval(() => {
      fetchQuoteData(false);
    }, intervalMs);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [amountUsdc, intervalMs, parsedAmount]);

  return {
    minterCap,
    loading,
    networkFeeUsdc,
    estimatedMinutes,
    canBridge,
    blockReason
  };
}