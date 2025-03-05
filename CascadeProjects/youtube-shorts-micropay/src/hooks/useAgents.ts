import { useState } from 'react';

interface UseAgentsProps {
  onError?: (error: Error) => void;
}

export const useAgents = ({ onError }: UseAgentsProps = {}) => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

  // Process payment using LangChain agent
  const processPayment = async (
    userPrivateKey: string,
    creatorAddress: string,
    amount: string,
    contentId: string
  ) => {
    setIsProcessingPayment(true);
    try {
      const response = await fetch('/api/agent/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userPrivateKey,
          creatorAddress,
          amount,
          contentId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process payment');
      }

      return await response.json();
    } catch (error: any) {
      if (onError) {
        onError(error);
      }
      throw error;
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Get content recommendations using LangChain agent
  const getRecommendations = async (userPreferences: string, contentType: string) => {
    setIsLoadingRecommendations(true);
    try {
      const response = await fetch('/api/agent/recommend-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userPreferences,
          contentType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get recommendations');
      }

      return await response.json();
    } catch (error: any) {
      if (onError) {
        onError(error);
      }
      throw error;
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  // Get analytics using LangChain agent
  const getAnalytics = async (userAddress: string, timeframe: string) => {
    setIsLoadingAnalytics(true);
    try {
      const response = await fetch('/api/agent/analyze-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress,
          timeframe,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get analytics');
      }

      return await response.json();
    } catch (error: any) {
      if (onError) {
        onError(error);
      }
      throw error;
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  return {
    processPayment,
    getRecommendations,
    getAnalytics,
    isProcessingPayment,
    isLoadingRecommendations,
    isLoadingAnalytics,
  };
};
