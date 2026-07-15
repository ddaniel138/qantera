import { SxProps, Theme } from '@mui/material';

export type WalletButtonVariant = 'connect-wallet' | 'connect-to-faucet' | 'connect-wallet-second';

export const defaultButtonStyles: SxProps<Theme> = {
    backgroundColor: '#DDE1FF33',
    border: '1px solid #003EC733',
    color: '#003EC7',
    fontWeight: 700,
    borderRadius: '100px',
    textTransform: 'none',
    px: 2.5,
    py: 1,
    fontSize: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    '&:hover': {
        backgroundColor: '#DDE1FF66',
        border: '1px solid #003EC755',
    },
};

export const secondButtonStyles: SxProps<Theme> = {
    backgroundColor: '#0047CB',
    color: '#FFFFFF',
    fontWeight: 700,
    borderRadius: '100px',  
    textTransform: 'none',
    width: '100%',
    py: 1.5,
    px: 4,
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    border: 'none',
    '&:hover': {
        backgroundColor: '#0039A6',
        boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.15)',
    },
};

export const getVariantStyles = (variant: WalletButtonVariant): SxProps<Theme> => {
    switch (variant) {
        case 'connect-wallet-second':
            return secondButtonStyles;
        case 'connect-to-faucet':
            return defaultButtonStyles;
        case 'connect-wallet':
        default:
            return defaultButtonStyles;
    }
};

export const unsupportedStyles: SxProps<Theme> = {
    ...defaultButtonStyles,
    color: '#EF4444',
    border: '1px solid #EF444433',
    backgroundColor: '#EF444411',
};