import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  HStack,
  Badge,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
} from '@chakra-ui/react';
import { useWallet } from '@/contexts/WalletContext';

const WalletConnect: React.FC = () => {
  const { isConnected, account, balance, connect, disconnect, error } = useWallet();
  const [privateKey, setPrivateKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleConnect = async () => {
    if (!privateKey) {
      toast({
        title: 'Error',
        description: 'Please enter a private key',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      // Store private key in localStorage for LangChain agent to use
      // In a real app, this would be handled more securely
      localStorage.setItem('userPrivateKey', privateKey);
      
      await connect(privateKey);
      setPrivateKey('');
      onClose();
      toast({
        title: 'Connected',
        description: 'Wallet connected successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      // Error is handled by the context
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    // Remove private key from localStorage when disconnecting
    localStorage.removeItem('userPrivateKey');
    
    disconnect();
    toast({
      title: 'Disconnected',
      description: 'Wallet disconnected',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  // Format address for display
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <>
      <Box p={4} borderWidth="1px" borderRadius="lg" w="100%">
        {isConnected ? (
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Text fontWeight="bold">Wallet Connected</Text>
              <Badge colorScheme="green" p={2}>
                Connected
              </Badge>
            </HStack>
            
            <HStack justify="space-between">
              <Text>Address:</Text>
              <Text fontWeight="medium">
                {account ? formatAddress(account.address.hex()) : ''}
              </Text>
            </HStack>
            
            <HStack justify="space-between">
              <Text>Balance:</Text>
              <Text fontWeight="medium">{balance.toString()}</Text>
            </HStack>
            
            <Button colorScheme="red" onClick={handleDisconnect}>
              Disconnect Wallet
            </Button>
          </VStack>
        ) : (
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Text fontWeight="bold">Wallet Status</Text>
              <Badge colorScheme="red" p={2}>
                Not Connected
              </Badge>
            </HStack>
            
            <Text>Connect your wallet to start watching and paying for content.</Text>
            
            <Button colorScheme="blue" onClick={onOpen}>
              Connect Wallet
            </Button>
            
            {error && (
              <Text color="red.500" fontSize="sm">
                {error}
              </Text>
            )}
          </VStack>
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Connect Wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Text>
                Enter your private key to connect your wallet. For security, never share your private key with anyone.
              </Text>
              <FormControl>
                <FormLabel>Private Key</FormLabel>
                <Input
                  type="password"
                  placeholder="Enter your private key"
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                />
              </FormControl>
              {error && (
                <Text color="red.500" fontSize="sm">
                  {error}
                </Text>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleConnect} 
              isLoading={isLoading}
              loadingText="Connecting"
            >
              Connect
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default WalletConnect;
