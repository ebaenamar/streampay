import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NewClient, NewAccount, withPrivateKey, Address, AddressFromHex } from '@radiustechsystems/sdk';

interface WalletContextType {
  isConnected: boolean;
  account: any | null;
  client: any | null;
  balance: bigint;
  connect: (privateKey: string) => Promise<void>;
  disconnect: () => void;
  sendPayment: (recipientAddress: string, amount: bigint) => Promise<any>;
  checkBalance: () => Promise<bigint>;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<any | null>(null);
  const [client, setClient] = useState<any | null>(null);
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [error, setError] = useState<string | null>(null);

  // Initialize client on component mount
  useEffect(() => {
    const initClient = async () => {
      try {
        const endpoint = process.env.NEXT_PUBLIC_RADIUS_ENDPOINT || 'https://testnet.radiustech.xyz';
        const radiusClient = await NewClient(endpoint);
        setClient(radiusClient);
      } catch (err) {
        console.error('Failed to initialize Radius client:', err);
        setError('Failed to connect to Radius network');
      }
    };

    initClient();
  }, []);

  // Connect wallet with private key
  const connect = async (privateKey: string) => {
    try {
      if (!client) {
        throw new Error('Radius client not initialized');
      }

      setError(null);
      const newAccount = await NewAccount(withPrivateKey(privateKey, client));
      setAccount(newAccount);
      setIsConnected(true);
      
      // Get initial balance
      const currentBalance = await client.getBalance(newAccount.address);
      setBalance(currentBalance);
      
      return newAccount;
    } catch (err: any) {
      console.error('Failed to connect wallet:', err);
      setError(`Failed to connect wallet: ${err.message}`);
      throw err;
    }
  };

  // Disconnect wallet
  const disconnect = () => {
    setAccount(null);
    setIsConnected(false);
    setBalance(BigInt(0));
  };

  // Send payment to recipient
  const sendPayment = async (recipientAddress: string, amount: bigint) => {
    try {
      if (!client || !account) {
        throw new Error('Wallet not connected');
      }

      setError(null);
      const recipient = AddressFromHex(recipientAddress);
      const receipt = await account.send(client, recipient, amount);
      
      // Update balance after payment
      const newBalance = await client.getBalance(account.address);
      setBalance(newBalance);
      
      return receipt;
    } catch (err: any) {
      console.error('Payment failed:', err);
      setError(`Payment failed: ${err.message}`);
      throw err;
    }
  };

  // Check current balance
  const checkBalance = async (): Promise<bigint> => {
    try {
      if (!client || !account) {
        throw new Error('Wallet not connected');
      }

      const currentBalance = await client.getBalance(account.address);
      setBalance(currentBalance);
      return currentBalance;
    } catch (err: any) {
      console.error('Failed to check balance:', err);
      setError(`Failed to check balance: ${err.message}`);
      throw err;
    }
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        account,
        client,
        balance,
        connect,
        disconnect,
        sendPayment,
        checkBalance,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
