import React, { useState, useEffect, useRef } from 'react';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';
import { Box, Text, Progress, VStack, HStack, Badge, Button, useToast } from '@chakra-ui/react';
import { useWallet } from '@/contexts/WalletContext';
import { useAgents } from '@/hooks/useAgents';

interface YouTubePlayerProps {
  videoId: string;
  creatorAddress: string;
  pricePerSecond: bigint;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId, creatorAddress, pricePerSecond }) => {
  const { isConnected, account, balance, error: walletError } = useWallet();
  const { processPayment, isProcessingPayment } = useAgents({
    onError: (error) => {
      setError(error.message);
      toast({
        title: 'Payment failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [totalPaid, setTotalPaid] = useState<bigint>(BigInt(0));
  const [secondsWatched, setSecondsWatched] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const lastPaymentTimeRef = useRef<number>(0);
  const paymentIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const toast = useToast();

  // Handle player ready event
  const handleReady = (event: YouTubeEvent) => {
    setPlayer(event.target);
    setDuration(event.target.getDuration());
  };

  // Handle player state changes
  const handleStateChange = (event: YouTubeEvent) => {
    const playerState = event.data;
    
    // YouTube Player States: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
    if (playerState === 1) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  // Update current time
  useEffect(() => {
    let timeUpdateInterval: NodeJS.Timeout | null = null;
    
    if (player && isPlaying) {
      timeUpdateInterval = setInterval(() => {
        const currentTime = player.getCurrentTime();
        setCurrentTime(currentTime);
      }, 500);
    }
    
    return () => {
      if (timeUpdateInterval) {
        clearInterval(timeUpdateInterval);
      }
    };
  }, [player, isPlaying]);

  // Handle payment processing using LangChain agent
  useEffect(() => {
    if (!isConnected || !isPlaying || !player || !account) {
      if (paymentIntervalRef.current) {
        clearInterval(paymentIntervalRef.current);
        paymentIntervalRef.current = null;
      }
      return;
    }

    // Start payment interval (every second)
    paymentIntervalRef.current = setInterval(async () => {
      const now = Math.floor(player.getCurrentTime());
      
      // Only process payment if we've moved to a new second
      if (now > lastPaymentTimeRef.current) {
        try {
          setIsLoading(true);
          setError(null);
          
          // Use LangChain agent to process payment
          // In a real app, you would never send the private key to the backend
          // This is just for demonstration purposes
          // A proper implementation would use a secure wallet connection
          const privateKey = localStorage.getItem('userPrivateKey') || '';
          
          if (!privateKey) {
            throw new Error('Private key not found');
          }
          
          const result = await processPayment(
            privateKey,
            creatorAddress,
            pricePerSecond.toString(),
            videoId
          );
          
          if (result.success) {
            // Update payment tracking
            setTotalPaid(prevTotal => prevTotal + pricePerSecond);
            setSecondsWatched(prev => prev + 1);
            lastPaymentTimeRef.current = now;
            
            toast({
              title: 'Payment processed',
              description: `Paid ${pricePerSecond.toString()} for 1 second of content`,
              status: 'success',
              duration: 2000,
              isClosable: true,
              position: 'bottom-right',
            });
          } else {
            throw new Error(result.message || 'Payment failed');
          }
        } catch (err: any) {
          console.error('Payment failed:', err);
          setError(`Payment failed: ${err.message}`);
          
          // Pause video on payment failure
          if (player) {
            player.pauseVideo();
          }
          
          toast({
            title: 'Payment failed',
            description: err.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        } finally {
          setIsLoading(false);
        }
      }
    }, 1000);

    return () => {
      if (paymentIntervalRef.current) {
        clearInterval(paymentIntervalRef.current);
        paymentIntervalRef.current = null;
      }
    };
  }, [isConnected, isPlaying, player, account, creatorAddress, pricePerSecond, processPayment, toast, videoId]);

  // Clean up intervals when component unmounts
  useEffect(() => {
    return () => {
      if (paymentIntervalRef.current) {
        clearInterval(paymentIntervalRef.current);
      }
    };
  }, []);

  // Handle visibility change (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && player && isPlaying) {
        player.pauseVideo();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [player, isPlaying]);

  // Format time display (MM:SS)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <VStack spacing={4} w="100%" maxW="600px" mx="auto">
      <Box w="100%" position="relative" borderRadius="md" overflow="hidden">
        <YouTube
          videoId={videoId}
          opts={{
            height: '360',
            width: '100%',
            playerVars: {
              autoplay: 0,
              controls: 1,
              modestbranding: 1,
              rel: 0,
            },
          }}
          onReady={handleReady}
          onStateChange={handleStateChange}
        />
        
        {(isLoading || isProcessingPayment) && (
          <Progress 
            size="xs" 
            isIndeterminate 
            colorScheme="blue" 
            position="absolute" 
            bottom="0" 
            left="0" 
            right="0" 
          />
        )}
      </Box>
      
      <HStack w="100%" justify="space-between">
        <Text>{formatTime(currentTime)}</Text>
        <Progress 
          value={(currentTime / duration) * 100} 
          w="70%" 
          colorScheme="blue" 
          borderRadius="full"
        />
        <Text>{formatTime(duration)}</Text>
      </HStack>
      
      <HStack w="100%" justify="space-between">
        <Badge colorScheme="green" fontSize="md" p={2}>
          Price: {pricePerSecond.toString()} / second
        </Badge>
        <Badge colorScheme="purple" fontSize="md" p={2}>
          Total paid: {totalPaid.toString()}
        </Badge>
        <Badge colorScheme="blue" fontSize="md" p={2}>
          Seconds watched: {secondsWatched}
        </Badge>
      </HStack>
      
      {(error || walletError) && (
        <Text color="red.500" w="100%" p={2} bg="red.50" borderRadius="md">
          {error || walletError}
        </Text>
      )}
      
      {!isConnected && (
        <Text color="orange.500" w="100%" p={2} bg="orange.50" borderRadius="md">
          Please connect your wallet to watch and pay for this content.
        </Text>
      )}
    </VStack>
  );
};

export default YouTubePlayer;
