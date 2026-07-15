import '@/styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
// import { base } from 'wagmi/chains';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';

import { DM_Sans, Inter, JetBrains_Mono } from 'next/font/google';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from '@/theme';

import { qantera } from '@/chains';
import WalletDiscoveryProvider from '@/providers/WalletDiscoveryProvider';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

const jetBrainsMono = JetBrains_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-jetBrain-mono',
});

const config = getDefaultConfig({
  appName: 'Qantera Network Dapp',
  projectId: '907ea2af750c109729f4e2c6380fde7b',
  chains: [qantera],
  ssr: true,
});

const queryClient = new QueryClient();

const SITE_TITLE =
  'Qantera Testnet — Qantera is a quantum-resistant Layer 1 built for long-term blockchain security.';

const SITE_DESCRIPTION =
  'Qantera is a quantum-resistant Layer 1 built for long-term blockchain security.';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>{SITE_TITLE}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
      </Head>
      <CssBaseline />
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <WalletDiscoveryProvider>
            <RainbowKitProvider>
              <div className={`
              ${inter.variable}
              ${dmSans.variable}
              ${jetBrainsMono.variable}
          `}>
                <Component {...pageProps} />
              </div>
            </RainbowKitProvider>
          </WalletDiscoveryProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}