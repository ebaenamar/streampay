import type { NextApiRequest, NextApiResponse } from 'next';
import { createAnalyticsAgent } from '@/utils/langchainAgents';

type ResponseData = {
  success: boolean;
  message: string;
  analytics?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { userAddress, timeframe } = req.body;

    // Validate input parameters
    if (!userAddress || !timeframe) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: userAddress, timeframe',
      });
    }

    // Create and run the analytics agent
    const analyticsAgent = await createAnalyticsAgent();
    
    const result = await analyticsAgent.invoke({
      input: `Analyze watch data and payment patterns for user ${userAddress} over the ${timeframe} timeframe.`,
      userAddress,
      timeframe,
    });

    // Parse the analytics from the result
    let analytics;
    try {
      // Try to extract JSON from the agent's response
      const jsonMatch = result.output.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analytics = JSON.parse(jsonMatch[0]);
      } else {
        // If no JSON found, use the raw output
        analytics = result.output;
      }
    } catch (parseError) {
      // If parsing fails, use the raw output
      analytics = result.output;
    }

    return res.status(200).json({
      success: true,
      message: 'Analytics generated successfully',
      analytics,
    });
  } catch (error: any) {
    console.error('Analytics generation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Analytics generation failed',
      error: error.message,
    });
  }
}
