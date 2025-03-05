import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Divider,
  useColorModeValue,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import WalletConnect from '@/components/WalletConnect';
import VideoSelector from '@/components/VideoSelector';
import YouTubePlayer from '@/components/YouTubePlayer';
import ContentRecommendations from '@/components/ContentRecommendations';
import UserAnalytics from '@/components/UserAnalytics';

const Home: NextPage = () => {
  const [selectedVideo, setSelectedVideo] = useState<{
    videoId: string;
    creatorAddress: string;
    pricePerSecond: bigint;
  } | null>(null);

  const handleVideoSelect = (videoId: string, creatorAddress: string, pricePerSecond: bigint) => {
    setSelectedVideo({ videoId, creatorAddress, pricePerSecond });
  };

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');

  return (
    <>
      <Head>
        <title>YouTube Shorts Micropayment</title>
        <meta name="description" content="Watch YouTube Shorts and pay per second" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box bg={bgColor} minH="100vh" py={10}>
        <Container maxW="container.lg">
          <VStack spacing={8} align="stretch">
            <Box textAlign="center">
              <Heading as="h1" size="xl" mb={2}>
                YouTube Shorts Micropayment
              </Heading>
              <Text fontSize="lg" color="gray.600">
                Watch YouTube Shorts videos and pay creators per second of playback
              </Text>
            </Box>

            <WalletConnect />
            
            <Tabs variant="enclosed" colorScheme="blue" mt={6}>
              <TabList>
                <Tab>Watch</Tab>
                <Tab>Discover</Tab>
                <Tab>Analytics</Tab>
              </TabList>
              
              <TabPanels>
                <TabPanel p={0} pt={4}>
                  <Flex 
                    direction={{ base: 'column', md: 'row' }}
                    gap={6}
                    align="start"
                  >
                    <Box w={{ base: '100%', md: '30%' }}>
                      <VideoSelector onVideoSelect={handleVideoSelect} />
                    </Box>
                    
                    <Box 
                      flex="1"
                      bg={cardBgColor}
                      p={6}
                      borderRadius="lg"
                      borderWidth="1px"
                      w={{ base: '100%', md: '70%' }}
                    >
                      {selectedVideo ? (
                        <YouTubePlayer
                          videoId={selectedVideo.videoId}
                          creatorAddress={selectedVideo.creatorAddress}
                          pricePerSecond={selectedVideo.pricePerSecond}
                        />
                      ) : (
                        <Box 
                          height="360px" 
                          display="flex" 
                          alignItems="center" 
                          justifyContent="center"
                          borderRadius="md"
                          bg="gray.100"
                        >
                          <Text fontSize="lg" color="gray.500">
                            Select a video to start watching and paying
                          </Text>
                        </Box>
                      )}
                    </Box>
                  </Flex>
                </TabPanel>
                
                <TabPanel p={0} pt={4}>
                  <ContentRecommendations onSelectVideo={handleVideoSelect} />
                </TabPanel>
                
                <TabPanel p={0} pt={4}>
                  <UserAnalytics />
                </TabPanel>
              </TabPanels>
            </Tabs>

            <Divider />

            <Box>
              <Heading as="h2" size="md" mb={4}>
                How It Works
              </Heading>
              <VStack spacing={4} align="stretch">
                <Box p={4} borderWidth="1px" borderRadius="lg">
                  <Heading as="h3" size="sm" mb={2}>
                    1. Connect Your Wallet
                  </Heading>
                  <Text>Connect your wallet with Radius Technology to enable micropayments.</Text>
                </Box>

                <Box p={4} borderWidth="1px" borderRadius="lg">
                  <Heading as="h3" size="sm" mb={2}>
                    2. Discover or Select a Video
                  </Heading>
                  <Text>Browse AI-recommended videos or enter a YouTube Shorts URL with creator details.</Text>
                </Box>

                <Box p={4} borderWidth="1px" borderRadius="lg">
                  <Heading as="h3" size="sm" mb={2}>
                    3. Watch and Pay
                  </Heading>
                  <Text>As you watch the video, AI-powered micropayments are automatically sent to the creator every second.</Text>
                </Box>
                
                <Box p={4} borderWidth="1px" borderRadius="lg">
                  <Heading as="h3" size="sm" mb={2}>
                    4. Track Your Analytics
                  </Heading>
                  <Text>View your watching habits, spending patterns, and content preferences through AI-generated analytics.</Text>
                </Box>
              </VStack>
            </Box>
          </VStack>
        </Container>
      </Box>
    </>
  );
};

export default Home;
