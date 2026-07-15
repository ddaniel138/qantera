import { useAccount } from 'wagmi';
import { Chain } from '@rainbow-me/rainbowkit';

export const getChainNativeCurrency = (chain?: Chain | null) => {
  if (!chain || !chain.nativeCurrency) {
    return { name: 'QTER', symbol: 'QTER', decimals: 18 };
  }
  return {
    name: chain.nativeCurrency.name,
    symbol: chain.nativeCurrency.symbol,
    decimals: chain.nativeCurrency.decimals,
  };
};

export const useActiveChainCurrency = () => {
  const { chain } = useAccount();
  
  return getChainNativeCurrency(chain as unknown as Chain);
};