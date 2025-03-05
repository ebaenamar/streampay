import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { WalletProvider } from '@/contexts/WalletContext';
import '@/styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <WalletProvider>
        <Component {...pageProps} />
      </WalletProvider>
    </ChakraProvider>
  );
}

export default MyApp;
