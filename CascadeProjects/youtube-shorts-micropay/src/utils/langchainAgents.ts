import { ChatOpenAI } from '@langchain/openai';
import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { formatToOpenAIFunctionMessages } from 'langchain/agents/format_scratchpad';
import { NewClient, NewAccount, withPrivateKey, AddressFromHex } from '@radiustechsystems/sdk';

// Initialize OpenAI model
const getOpenAIModel = () => {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key is not set');
  }
  
  return new ChatOpenAI({
    openAIApiKey: apiKey,
    modelName: 'gpt-4-turbo',
    temperature: 0,
  });
};

// Initialize Radius client
const getRadiusClient = async () => {
  const endpoint = process.env.NEXT_PUBLIC_RADIUS_ENDPOINT || 'https://testnet.radiustech.xyz';
  return await NewClient(endpoint);
};

// Tool for processing micropayments
const createMicroPaymentTool = () => {
  return new DynamicStructuredTool({
    name: 'process_micropayment',
    description: 'Process a micropayment from a user to a content creator',
    schema: z.object({
      userPrivateKey: z.string().describe('The private key of the user sending the payment'),
      creatorAddress: z.string().describe('The wallet address of the content creator receiving the payment'),
      amount: z.string().describe('The amount to send as a string representation of a BigInt'),
      contentId: z.string().describe('The ID of the content being paid for'),
    }),
    func: async ({ userPrivateKey, creatorAddress, amount, contentId }) => {
      try {
        // Initialize Radius client
        const client = await getRadiusClient();
        
        // Create user account from private key
        const account = await NewAccount(withPrivateKey(userPrivateKey, client));
        
        // Convert creator address to Address object
        const recipient = AddressFromHex(creatorAddress);
        
        // Send payment
        const receipt = await account.send(client, recipient, BigInt(amount));
        
        // Return transaction details
        return JSON.stringify({
          success: true,
          txHash: receipt.txHash.hex(),
          from: account.address.hex(),
          to: creatorAddress,
          amount,
          contentId,
          timestamp: new Date().toISOString(),
        });
      } catch (error: any) {
        return JSON.stringify({
          success: false,
          error: error.message,
        });
      }
    },
  });
};

// Tool for checking user balance
const createBalanceCheckTool = () => {
  return new DynamicStructuredTool({
    name: 'check_user_balance',
    description: 'Check the balance of a user wallet',
    schema: z.object({
      userAddress: z.string().describe('The wallet address of the user'),
    }),
    func: async ({ userAddress }) => {
      try {
        // Initialize Radius client
        const client = await getRadiusClient();
        
        // Convert user address to Address object
        const address = AddressFromHex(userAddress);
        
        // Get balance
        const balance = await client.getBalance(address);
        
        return JSON.stringify({
          success: true,
          address: userAddress,
          balance: balance.toString(),
        });
      } catch (error: any) {
        return JSON.stringify({
          success: false,
          error: error.message,
        });
      }
    },
  });
};

// Tool for verifying content creator
const createVerifyCreatorTool = () => {
  return new DynamicStructuredTool({
    name: 'verify_content_creator',
    description: 'Verify if a content creator is registered and eligible to receive payments',
    schema: z.object({
      creatorAddress: z.string().describe('The wallet address of the content creator'),
      contentId: z.string().describe('The ID of the content to verify'),
    }),
    func: async ({ creatorAddress, contentId }) => {
      try {
        // In a real implementation, this would check against a database
        // For now, we'll simulate verification
        const isVerified = creatorAddress.startsWith('0x');
        const randomScore = Math.floor(Math.random() * 100);
        
        return JSON.stringify({
          success: true,
          isVerified,
          creatorAddress,
          contentId,
          contentScore: randomScore,
          registrationDate: new Date().toISOString(),
        });
      } catch (error: any) {
        return JSON.stringify({
          success: false,
          error: error.message,
        });
      }
    },
  });
};

// Create the payment agent
export const createPaymentAgent = async () => {
  const model = getOpenAIModel();
  
  const tools = [
    createMicroPaymentTool(),
    createBalanceCheckTool(),
    createVerifyCreatorTool(),
  ];
  
  const prompt = PromptTemplate.fromTemplate(`
    You are an AI agent responsible for managing micropayments for YouTube Shorts videos.
    Your job is to process payments from viewers to content creators based on watch time.
    
    For each second of content watched, you need to process a micropayment from the viewer to the creator.
    Make sure to verify the creator is legitimate and the user has sufficient balance before processing payments.
    
    Current request: {input}
    
    Think through this step-by-step to determine the best course of action.
  `);
  
  const agent = await createOpenAIFunctionsAgent({
    llm: model,
    tools,
    prompt,
  });
  
  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: true,
  });
  
  return agentExecutor;
};

// Create the content recommendation agent
export const createRecommendationAgent = async () => {
  const model = getOpenAIModel();
  
  const recommendContentTool = new DynamicStructuredTool({
    name: 'recommend_content',
    description: 'Recommend YouTube Shorts content based on user preferences',
    schema: z.object({
      userPreferences: z.string().describe('User preferences and watch history'),
      contentType: z.string().describe('Type of content to recommend (e.g., educational, entertainment)'),
    }),
    func: async ({ userPreferences, contentType }) => {
      // Simulate content recommendation
      // In a real implementation, this would use a recommendation algorithm
      const recommendations = [
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
      
      return JSON.stringify({
        success: true,
        recommendations,
      });
    },
  });
  
  const tools = [recommendContentTool];
  
  const prompt = PromptTemplate.fromTemplate(`
    You are an AI agent responsible for recommending YouTube Shorts videos to users.
    Your job is to suggest content that matches the user's preferences and interests.
    
    Current request: {input}
    
    Think through this step-by-step to determine the best recommendations.
  `);
  
  const agent = await createOpenAIFunctionsAgent({
    llm: model,
    tools,
    prompt,
  });
  
  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: true,
  });
  
  return agentExecutor;
};

// Create the analytics agent
export const createAnalyticsAgent = async () => {
  const model = getOpenAIModel();
  
  const analyzeWatchDataTool = new DynamicStructuredTool({
    name: 'analyze_watch_data',
    description: 'Analyze user watch data and payment patterns',
    schema: z.object({
      userAddress: z.string().describe('The wallet address of the user'),
      timeframe: z.string().describe('Timeframe for analysis (e.g., day, week, month)'),
    }),
    func: async ({ userAddress, timeframe }) => {
      // Simulate analytics data
      // In a real implementation, this would query a database
      const totalWatchTime = Math.floor(Math.random() * 3600); // seconds
      const totalSpent = Math.floor(Math.random() * 1000);
      const videoCount = Math.floor(Math.random() * 20);
      
      return JSON.stringify({
        success: true,
        userAddress,
        timeframe,
        analytics: {
          totalWatchTime,
          totalSpent,
          videoCount,
          averageWatchTime: totalWatchTime / (videoCount || 1),
          averageCostPerVideo: totalSpent / (videoCount || 1),
        },
      });
    },
  });
  
  const tools = [analyzeWatchDataTool];
  
  const prompt = PromptTemplate.fromTemplate(`
    You are an AI agent responsible for analyzing user watch data and payment patterns.
    Your job is to provide insights on user behavior and spending habits.
    
    Current request: {input}
    
    Think through this step-by-step to provide the most useful analytics.
  `);
  
  const agent = await createOpenAIFunctionsAgent({
    llm: model,
    tools,
    prompt,
  });
  
  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: true,
  });
  
  return agentExecutor;
};
