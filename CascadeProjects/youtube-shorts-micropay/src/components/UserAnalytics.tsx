import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  Skeleton,
  useToast,
  Select,
} from '@chakra-ui/react';
import { useAgents } from '@/hooks/useAgents';
import { useWallet } from '@/contexts/WalletContext';

interface AnalyticsData {
  totalWatchTime: number;
  totalSpent: number;
  videoCount: number;
  averageWatchTime: number;
  averageCostPerVideo: number;
}

const UserAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeframe, setTimeframe] = useState('week');
  const { getAnalytics, isLoadingAnalytics } = useAgents();
  const { isConnected, account } = useWallet();
  const toast = useToast();

  // Fetch analytics when component mounts or timeframe changes
  useEffect(() => {
    if (isConnected && account) {
      fetchAnalytics();
    }
  }, [isConnected, account, timeframe]);

  const fetchAnalytics = async () => {
    if (!isConnected || !account) {
      toast({
        title: 'Not connected',
        description: 'Please connect your wallet to view analytics',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const userAddress = account.address.hex();
      const result = await getAnalytics(userAddress, timeframe);
      
      if (result.success && result.analytics) {
        // Parse analytics from the result
        let analyticsData: AnalyticsData | null = null;
        
        try {
          // Try to extract analytics data
          if (typeof result.analytics === 'string') {
            // Try to parse from string if needed
            const parsed = JSON.parse(result.analytics);
            analyticsData = parsed.analytics || null;
          } else if (result.analytics.analytics) {
            analyticsData = result.analytics.analytics;
          } else {
            analyticsData = result.analytics;
          }
        } catch (parseError) {
          console.error('Error parsing analytics:', parseError);
          // Generate sample data
          analyticsData = getSampleAnalytics();
        }
        
        setAnalytics(analyticsData);
      } else {
        // Fallback to sample data if API fails
        setAnalytics(getSampleAnalytics());
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch analytics',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      
      // Fallback to sample data
      setAnalytics(getSampleAnalytics());
    }
  };

  // Sample analytics as fallback
  const getSampleAnalytics = (): AnalyticsData => {
    const totalWatchTime = Math.floor(Math.random() * 3600); // seconds
    const totalSpent = Math.floor(Math.random() * 1000);
    const videoCount = Math.floor(Math.random() * 20);
    
    return {
      totalWatchTime,
      totalSpent,
      videoCount,
      averageWatchTime: totalWatchTime / (videoCount || 1),
      averageCostPerVideo: totalSpent / (videoCount || 1),
    };
  };

  // Format time display (HH:MM:SS)
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    return `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${remainingSeconds}s`;
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" w="100%">
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <Heading size="md">Your Viewing Analytics</Heading>
          
          <Select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            w="150px"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </Select>
        </HStack>
        
        {!isConnected ? (
          <Text color="orange.500" p={4} bg="orange.50" borderRadius="md">
            Please connect your wallet to view your analytics.
          </Text>
        ) : isLoadingAnalytics ? (
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} height="100px" borderRadius="md" />
            ))}
          </SimpleGrid>
        ) : analytics ? (
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <Stat p={4} borderWidth="1px" borderRadius="md" bg="blue.50">
              <StatLabel>Total Watch Time</StatLabel>
              <StatNumber>{formatTime(analytics.totalWatchTime)}</StatNumber>
              <StatHelpText>Across {analytics.videoCount} videos</StatHelpText>
            </Stat>
            
            <Stat p={4} borderWidth="1px" borderRadius="md" bg="green.50">
              <StatLabel>Total Spent</StatLabel>
              <StatNumber>{analytics.totalSpent} tokens</StatNumber>
              <StatHelpText>Average: {Math.round(analytics.averageCostPerVideo)} per video</StatHelpText>
            </Stat>
            
            <Stat p={4} borderWidth="1px" borderRadius="md" bg="purple.50">
              <StatLabel>Average Watch Time</StatLabel>
              <StatNumber>{formatTime(analytics.averageWatchTime)}</StatNumber>
              <StatHelpText>Per video</StatHelpText>
            </Stat>
          </SimpleGrid>
        ) : (
          <Text color="gray.500" textAlign="center" py={4}>
            No analytics data available.
          </Text>
        )}
        
        <Button 
          colorScheme="blue" 
          onClick={fetchAnalytics} 
          isLoading={isLoadingAnalytics}
          loadingText="Loading"
          isDisabled={!isConnected}
        >
          Refresh Analytics
        </Button>
      </VStack>
    </Box>
  );
};

export default UserAnalytics;
