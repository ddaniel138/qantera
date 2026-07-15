import React from 'react';
import { Box, Button } from '@mui/material';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { WalletIcon } from '@/components/icons';
import { WalletButtonVariant, getVariantStyles, unsupportedStyles } from './theme';

export interface ConnectWalletButtonProps {
    variant?: WalletButtonVariant;
    onConnectClick: () => void;
    showIcon?: boolean;
}

export default function ConnectWalletButton({
    variant = 'connect-wallet',
    onConnectClick,
    showIcon = true,
}: ConnectWalletButtonProps) {

    const currentStyles = getVariantStyles(variant);

    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                authenticationStatus,
                mounted,
            }) => {
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus || authenticationStatus === 'authenticated');

                if (!ready) {
                    return (
                        <Box
                            aria-hidden="true"
                            sx={{ opacity: 0, pointerEvents: 'none', userSelect: 'none' }}
                        />
                    );
                }

                return (
                    <div
                        {...(ready
                            ? {}
                            : {
                                'aria-hidden': true,
                                style: {
                                    opacity: 0,
                                    pointerEvents: 'none',
                                    userSelect: 'none',
                                },
                            })}
                    >
                        {(() => {
                            if (!connected) {
                                return (
                                    <Button onClick={onConnectClick} sx={currentStyles}>
                                        { showIcon ? <WalletIcon /> : null}
                                        Connect Wallet
                                    </Button>
                                );
                            }

                            if (chain.unsupported) {
                                return (
                                    <Button onClick={openChainModal} sx={unsupportedStyles}>
                                        Wrong network
                                    </Button>
                                );
                            }

                            return (
                                <Button onClick={openAccountModal} sx={currentStyles}>
                                    <WalletIcon />
                                    {account.displayName}
                                </Button>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
}