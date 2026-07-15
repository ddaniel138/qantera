/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DataPanel from './DataPanel';
import { BaseIcon } from './svg/BaseIcon';
import { ArcIcon } from './svg/ArcIcon';
import { useAccount, useBalance, useSendTransaction } from 'wagmi';
import {
    ARC_BRIDGE,
    getUsdcAllowance,
    buildApproveUsdcTx,
    buildBurnWithHookTx,
    fetchBridgeStatus,
    getForwardQuote
} from '@/utils/arc-bridge-sdk.mjs';
import { useBridgePolling } from '@/hooks/useBridgePolling';
import { useBridgeTransactions } from '@/hooks/useBridgeTransactions';

const CardContainer = styled.div` width: 100%; background: #131315; border: 1px solid #232326; border-radius: 16px; padding: 32px 28px; box-shadow: 0px 24px 48px rgba(0, 0, 0, 0.6); `;
const InputSection = styled.div` display: flex; flex-direction: column; gap: 10px; position: relative; `;
const SectionHeader = styled.div` display: flex; justify-content: space-between; align-items: center; padding: 0 2px; `;
const Label = styled.span` font-family: var(--font-space-mono), monospace; font-size: 16px; color: #C0C7CE; text-transform: uppercase; font-weight: 700; letter-spacing: 0.06em; `;
const BalanceText = styled.span` font-family: var(--font-space-mono), monospace; font-size: 14px; color: #C0C7CE; letter-spacing: -0.01em; `;
const BoxRow = styled.div` background: #2A2A2A; border: 1px solid #2A2A2A; border-radius: 4px; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; transition: border-color 0.2s; &:focus-within { border-color: #3F3F46; } `;
const Selector = styled.div` display: flex; align-items: center; gap: 12px; cursor: pointer; `;
const ChainName = styled.span` font-family: var(--font-dm-sans), sans-serif; font-size: 16px; font-weight: 700; color: #FFFFFF; `;
const InputContainer = styled.div` display: flex; align-items: center; justify-content: flex-end; flex: 1; `;
const AmountInput = styled.input` background: transparent; border: none; font-family: var(--font-dm-sans), sans-serif; font-size: 26px; font-weight: 700; color: #FFFFFF; text-align: right; width: 100%; max-width: 160px; outline: none; padding: 0; &::placeholder { color: #4E4E54; } `;
const TokenLabel = styled.span` font-family: var(--font-dm-sans), sans-serif; font-size: 14px; color: #71717A; margin-left: 12px; font-weight: 600; `;
const ArrowWrapper = styled.div` position: relative; display: flex; align-items: center; justify-content: center; width: 100%; height: 32px; margin: 24px 0; `;
const MidDivider = styled.div` position: absolute; width: 100%; height: 1px; background: #232326; z-index: 1; `;
const ArrowButton = styled.div` position: absolute; z-index: 2; width: 32px; height: 32px; background: #222224; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #FFFFFF; cursor: pointer; font-size: 14px; transition: all 0.15s ease-in-out; &:hover { background: #2D2D30; transform: scale(1.05); } &:active { transform: scale(0.95); } `;
const Divider = styled.div` height: 1px; background: #232326; margin: 24px 0 12px 0; `;
const ErrorMsg = styled.div` color: #EF4444; font-size: 12px; margin-top: 8px; font-family: var(--font-dm-sans), sans-serif; `;
const SuccessMsg = styled.div` color: #22C55E; font-size: 12px; margin-top: 8px; font-family: var(--font-dm-sans), sans-serif; `;

const ActionButton = styled.button`
  width: 100%;
  background: linear-gradient(180deg, #021633 0.57%, #2C4D68 100.57%);
  border-radius: 4px;
  color: #FFFFFF;
  padding: 16px;
  font-family: var(--font-dm-sans), sans-serif;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);

  &:hover { opacity: 0.95; }
  &:active { transform: scale(0.99); }
  &:disabled {
    background: #232326;
    color: #4E4E54;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

export default function BridgeCard() {
    const [amount, setAmount] = useState<string>('');
    const [allowance, setAllowance] = useState<bigint>(BigInt(0));
    const [txLoading, setTxLoading] = useState<boolean>(false);
    const [statusMsg, setStatusMsg] = useState<{ type: 'error' | 'success' | '', text: string }>({ type: '', text: '' });

    const { address, isConnected } = useAccount();
    const { sendTransactionAsync } = useSendTransaction();

    const { addBridgeTransaction } = useBridgeTransactions();

    const { data: balanceData, refetch: refetchBalance } = useBalance({
        address: address,
        token: ARC_BRIDGE.usdcBase,
    });

    const { minterCap, loading, networkFeeUsdc, estimatedMinutes, blockReason, canBridge } = useBridgePolling(amount, 40000);

    const parsedAmount = parseFloat(amount) || 0;
    const balanceNumber = balanceData ? parseFloat(balanceData.formatted) : 0;

    const isAmountLessThanFee = amount !== '' && parsedAmount > 0 && parsedAmount <= networkFeeUsdc;
    const isInsufficientBalance = amount !== '' && parsedAmount > balanceNumber;

    useEffect(() => {
        if (!address || !isConnected) return;

        const checkAllowance = async () => {
            try {
                const currentAllowance = await getUsdcAllowance(address);
                setAllowance(BigInt(currentAllowance.toString()));
            } catch (err) {
                console.error("Failed to read allowance:", err);
            }
        };

        checkAllowance();
        const interval = setInterval(checkAllowance, 10000);
        return () => clearInterval(interval);
    }, [address, isConnected]);

    const renderBalance = () => {
        if (!isConnected || !balanceData) return '0.00';
        return parseFloat(balanceData.formatted).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // const handleBridgeAction = async () => {
    //     if (!isConnected || !address || !canBridge) return;

    //     setTxLoading(true);
    //     // setStatusMsg({ type: '', text: '' });

    //     try {
    //         const parsedAmount = parseFloat(amount);
    //         const amountRaw = BigInt(Math.round(parsedAmount * 1_000_000));

    //         if (allowance < amountRaw) {
    //             // setStatusMsg({ type: '', text: 'Please approve USDC allowance in your wallet...' });

    //             const approveTxData = buildApproveUsdcTx({
    //                 spender: ARC_BRIDGE.tokenMessengerBase,
    //                 amountRaw: amountRaw.toString()
    //             });

    //             const txApproveHash = await sendTransactionAsync({
    //                 to: approveTxData.to as `0x${string}`,
    //                 data: approveTxData.data as `0x${string}`,
    //                 value: approveTxData.value
    //             });

    //             // setStatusMsg({ type: '', text: 'Allowance transaction submitted. Waiting confirmation...' });
    //             setAllowance(amountRaw);
    //         }

    //         // setStatusMsg({ type: '', text: 'Preparing bridge transaction...' });

    //         const burnTxData = await buildBurnWithHookTx({
    //             recipient: address,
    //             amountUsdc: parsedAmount
    //         });

    //         // setStatusMsg({ type: '', text: 'Please confirm the bridge transaction in your wallet...' });

    //         const txBridgeHash = await sendTransactionAsync({
    //             to: burnTxData.to as `0x${string}`,
    //             data: burnTxData.data as `0x${string}`,
    //             value: burnTxData.value
    //         });

    //         addBridgeTransaction(txBridgeHash, {
    //             toChainId: ARC_BRIDGE.arcChainId,
    //             amount: amount,
    //             tokenSymbol: 'USDC'
    //         });

    //         // setStatusMsg({
    //         //     type: 'success',
    //         //     text: `Bridge submitted successfully! Tx: ${txBridgeHash.slice(0, 6)}...${txBridgeHash.slice(-4)}`
    //         // });

    //         setAmount('');
    //         refetchBalance();

    //     } catch (error: any) {
    //         console.error("Bridge execute error:", error);
    //         // setStatusMsg({
    //         //     type: 'error',
    //         //     text: error?.shortMessage || error?.message || 'Transaction rejected or execution failed.'
    //         // });
    //     } finally {
    //         setTxLoading(false);
    //     }
    // };

    const handleBridgeAction = async () => {
        if (!isConnected || !address || !canBridge || isAmountLessThanFee || isInsufficientBalance) return;
    
        setTxLoading(true);
    
        try {
            const amountRaw = BigInt(Math.round(parsedAmount * 1_000_000));
    
            if (allowance < amountRaw) {
                const approveTxData = buildApproveUsdcTx({
                    spender: ARC_BRIDGE.tokenMessengerBase,
                    amountRaw: amountRaw.toString() 
                });
    
                await sendTransactionAsync({
                    to: approveTxData.to as `0x${string}`,
                    data: approveTxData.data as `0x${string}`,
                    value: approveTxData.value
                });
    
                setAllowance(amountRaw);
            }
    
            const burnTxData = await buildBurnWithHookTx({
                recipient: address,
                amountUsdc: parsedAmount
            });
    
            const txBridgeHash = await sendTransactionAsync({
                to: burnTxData.to as `0x${string}`,
                data: burnTxData.data as `0x${string}`,
                value: burnTxData.value
            });
    
            addBridgeTransaction(txBridgeHash, {
                toChainId: ARC_BRIDGE.arcChainId,
                amount: amount,
                tokenSymbol: 'USDC'
            });
    
            setAmount('');
            refetchBalance();
    
        } catch (error: any) {
            console.error("Bridge execute error:", error);
        } finally {
            setTxLoading(false);
        }
    };

    
    const getNetworkFeeLabel = () => {
        if (loading) return 'Calculating...';
        if (!amount || parseFloat(amount) <= 0) return '0.00 USDC';
        return `${networkFeeUsdc.toFixed(6)} USDC`;
    };

    const getMinterCapLabel = () => {
        if (loading) return 'Calculating...';
        if (!minterCap) return '-- USDC';
        return `${minterCap.maxSingleBridgeUsdc.toFixed(6)} USDC`;
    };

    const getEstimatedTimeLabel = () => {
        if (loading) return 'Calculating...';
        if (!amount) return '> 15 Minutes';
        return `~ ${estimatedMinutes} Minutes`;
    };

    const getButtonText = () => {
        if (loading) return 'Calculating...';
        if (txLoading) return 'Processing Transaction...';
        if (amount && parseFloat(amount) > 0 && allowance < BigInt(Math.round(parseFloat(amount) * 1_000_000))) {
            return 'Approve & Bridge USDC';
        }
        return 'Bridge USDC';
    };

    const isButtonDisabled = !isConnected || !address || loading || txLoading || amount === '' || parseFloat(amount) <= 0 || !canBridge;

    return (
        <CardContainer>
            <InputSection>
                <SectionHeader>
                    <Label>From</Label>
                    <BalanceText>Balance: {renderBalance()} USDC</BalanceText>
                </SectionHeader>
                <BoxRow>
                    <Selector>
                        <BaseIcon />
                        <ChainName>Base</ChainName>
                    </Selector>
                    <InputContainer>
                        <AmountInput
                            type="text"
                            placeholder="1000.00"
                            value={amount}
                            disabled={txLoading || !isConnected}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <TokenLabel>USDC</TokenLabel>
                    </InputContainer>
                </BoxRow>
            </InputSection>

            <ArrowWrapper>
                <MidDivider />
                <ArrowButton>↓</ArrowButton>
            </ArrowWrapper>

            <InputSection style={{ marginTop: '0px' }}>
                <SectionHeader>
                    <Label>To</Label>
                </SectionHeader>
                <BoxRow>
                    <Selector>
                        <ArcIcon />
                        <ChainName>Arc Network</ChainName>
                    </Selector>
                    <InputContainer>
                        <AmountInput
                            type="text"
                            placeholder={loading ? "Calculating..." : (amount ? amount : "1,000.00")}
                            disabled
                        />
                        <TokenLabel>USDC</TokenLabel>
                    </InputContainer>
                </BoxRow>
            </InputSection>

            {blockReason && <ErrorMsg>{blockReason}</ErrorMsg>}
            {/* {statusMsg.type === 'error' && <ErrorMsg>{statusMsg.text}</ErrorMsg>}
            {statusMsg.type === 'success' && <SuccessMsg>{statusMsg.text}</SuccessMsg>}
            {statusMsg.type === '' && statusMsg.text && (
                <div style={{ color: '#A1A1AA', fontSize: '12px', marginTop: '8px', fontFamily: 'var(--font-dm-sans)' }}>
                    {statusMsg.text}
                </div>
            )} */}

            <Divider />

            <DataPanel
                networkFee={getNetworkFeeLabel()}
                minterCap={getMinterCapLabel()}
                estimatedTime={getEstimatedTimeLabel()}
                router="Circle CCTP"
            />

            <ActionButton
                disabled={isButtonDisabled}
                onClick={handleBridgeAction}
            >
                {getButtonText()}
            </ActionButton>
        </CardContainer>
    );
}