import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Image,
  Badge,
  SimpleGrid,
  Skeleton,
  useToast,
  Select,
} from '@chakra-ui/react';
import { useAgents } from '@/hooks/useAgents';

interface VideoRecommendation {
  videoId: string;
  title: string;
  creator: string;
  creatorAddress: string;
  pricePerSecond: string;
  category: string;
}

interface ContentRecommendationsProps {
  onSelectVideo: (videoId: string, creatorAddress: string, pricePerSecond: bigint) => void;
}

const ContentRecommendations: React.FC<ContentRecommendationsProps> = ({ onSelectVideo }) => {
  const [recommendations, setRecommendations] = useState<VideoRecommendation[]>([]);
  const [contentType, setContentType] = useState('entertainment');
  const [userPreferences, setUserPreferences] = useState('music, short videos');
  const { getRecommendations, isLoadingRecommendations } = useAgents();
  const toast = useToast();

  // Fetch recommendations when component mounts or preferences change
  useEffect(() => {
    fetchRecommendations();
  }, [contentType, userPreferences]);

  const fetchRecommendations = async () => {
    try {
      const result = await getRecommendations(userPreferences, contentType);
      
      if (result.success && result.recommendations) {
        // Parse recommendations from the result
        let recommendationData: VideoRecommendation[] = [];
        
        try {
          // Try to extract recommendations array
          if (typeof result.recommendations === 'string') {
            // Try to parse from string if needed
            const parsed = JSON.parse(result.recommendations);
            recommendationData = parsed.recommendations || [];
          } else if (result.recommendations.recommendations) {
            recommendationData = result.recommendations.recommendations;
          } else if (Array.isArray(result.recommendations)) {
            recommendationData = result.recommendations;
          }
        } catch (parseError) {
          console.error('Error parsing recommendations:', parseError);
          // Fallback to sample data
          recommendationData = getSampleRecommendations();
        }
        
        setRecommendations(recommendationData);
      } else {
        // Fallback to sample data if API fails
        setRecommendations(getSampleRecommendations());
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch recommendations',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      
      // Fallback to sample data
      setRecommendations(getSampleRecommendations());
    }
  };

  // Sample recommendations as fallback
  const getSampleRecommendations = (): VideoRecommendation[] => {
    return [
      {
        videoId: 'dQw4w9WgXcQ',
        title: 'Never Gonna Give You Up',
        creator: 'Rick Astley',
        creatorAddress: '0x1234567890abcdef1234567890abcdef12345678',
        pricePerSecond: '1',
        category: 'Music',
      },
      {
        videoId: '9bZkp7q19f0',
        title: 'Gangnam Style',
        creator: 'PSY',
        creatorAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
        pricePerSecond: '2',
        category: 'Music',
      },
      {
        videoId: 'jNQXAC9IVRw',
        title: 'Me at the zoo',
        creator: 'jawed',
        creatorAddress: '0x7890abcdef1234567890abcdef1234567890abcd',
        pricePerSecond: '1',
        category: 'Vlog',
      },
    ];
  };

  const handleSelectVideo = (video: VideoRecommendation) => {
    onSelectVideo(video.videoId, video.creatorAddress, BigInt(video.pricePerSecond));
    
    toast({
      title: 'Video selected',
      description: `Now watching: ${video.title}`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleRefresh = () => {
    fetchRecommendations();
  };

  // Get YouTube thumbnail URL
  const getThumbnailUrl = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" w="100%">
      <VStack spacing={4} align="stretch">
        <Heading size="md">Recommended Videos</Heading>
        
        <HStack>
          <Select 
            value={contentType} 
            onChange={(e) => setContentType(e.target.value)}
            w="50%"
          >
            <option value="entertainment">Entertainment</option>
            <option value="educational">Educational</option>
            <option value="music">Music</option>
            <option value="gaming">Gaming</option>
          </Select>
          
          <Button 
            colorScheme="blue" 
            onClick={handleRefresh} 
            isLoading={isLoadingRecommendations}
            loadingText="Loading"
            ml="auto"
          >
            Refresh
          </Button>
        </HStack>
        
        {isLoadingRecommendations ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} height="200px" borderRadius="md" />
            ))}
          </SimpleGrid>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {recommendations.map((video) => (
              <Box 
                key={video.videoId} 
                borderWidth="1px" 
                borderRadius="md" 
                overflow="hidden"
                transition="transform 0.2s"
                _hover={{ transform: 'scale(1.02)' }}
              >
                <Image 
                  src={getThumbnailUrl(video.videoId)} 
                  alt={video.title}
                  w="100%"
                />
                
                <VStack p={3} align="start" spacing={1}>
                  <Text fontWeight="bold" noOfLines={1}>
                    {video.title}
                  </Text>
                  
                  <Text fontSize="sm" color="gray.600">
                    {video.creator}
                  </Text>
                  
                  <HStack>
                    <Badge colorScheme="green">
                      {video.pricePerSecond} / second
                    </Badge>
                    
                    <Badge colorScheme="blue">
                      {video.category}
                    </Badge>
                  </HStack>
                  
                  <Button 
                    size="sm" 
                    colorScheme="blue" 
                    mt={2} 
                    w="100%"
                    onClick={() => handleSelectVideo(video)}
                  >
                    Watch Now
                  </Button>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        )}
        
        {recommendations.length === 0 && !isLoadingRecommendations && (
          <Text color="gray.500" textAlign="center" py={4}>
            No recommendations available. Try changing your preferences or refreshing.
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default ContentRecommendations;
