import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Text,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';

interface VideoSelectorProps {
  onVideoSelect: (videoId: string, creatorAddress: string, pricePerSecond: bigint) => void;
}

const VideoSelector: React.FC<VideoSelectorProps> = ({ onVideoSelect }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [creatorAddress, setCreatorAddress] = useState('');
  const [pricePerSecond, setPricePerSecond] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Extract video ID from YouTube URL
  const extractVideoId = (url: string): string | null => {
    // Handle YouTube Shorts URLs
    const shortsRegex = /(?:youtube\.com\/shorts\/|youtu\.be\/)([^\?\/&]+)/;
    const shortsMatch = url.match(shortsRegex);
    if (shortsMatch && shortsMatch[1]) {
      return shortsMatch[1];
    }
    
    // Handle regular YouTube URLs
    const regularRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\?\/&]+)/;
    const regularMatch = url.match(regularRegex);
    if (regularMatch && regularMatch[1]) {
      return regularMatch[1];
    }
    
    return null;
  };

  const handleSubmit = () => {
    setIsLoading(true);
    
    try {
      // Validate video URL
      const videoId = extractVideoId(videoUrl);
      if (!videoId) {
        throw new Error('Invalid YouTube URL. Please enter a valid YouTube Shorts or video URL.');
      }
      
      // Validate creator address
      if (!creatorAddress || !creatorAddress.startsWith('0x')) {
        throw new Error('Invalid creator address. Address should start with 0x.');
      }
      
      // Validate price
      const price = BigInt(pricePerSecond);
      if (price <= BigInt(0)) {
        throw new Error('Price per second must be greater than 0.');
      }
      
      // Call the parent component's handler
      onVideoSelect(videoId, creatorAddress, price);
      
      toast({
        title: 'Video selected',
        description: 'You can now watch the video and pay per second',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" w="100%">
      <VStack spacing={4} align="stretch">
        <Text fontWeight="bold" fontSize="lg">
          Select a YouTube Shorts Video
        </Text>
        
        <FormControl isRequired>
          <FormLabel>YouTube Video URL</FormLabel>
          <Input
            placeholder="https://youtube.com/shorts/..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </FormControl>
        
        <FormControl isRequired>
          <FormLabel>Creator Wallet Address</FormLabel>
          <Input
            placeholder="0x..."
            value={creatorAddress}
            onChange={(e) => setCreatorAddress(e.target.value)}
          />
        </FormControl>
        
        <FormControl isRequired>
          <FormLabel>Price Per Second (in tokens)</FormLabel>
          <NumberInput
            min={1}
            value={pricePerSecond}
            onChange={(valueString) => setPricePerSecond(valueString)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        
        <Button
          colorScheme="blue"
          onClick={handleSubmit}
          isLoading={isLoading}
          loadingText="Loading"
        >
          Watch and Pay
        </Button>
      </VStack>
    </Box>
  );
};

export default VideoSelector;
