import type { NextApiRequest, NextApiResponse } from 'next';
import { createRecommendationAgent } from '@/utils/langchainAgents';

type ResponseData = {
  success: boolean;
  message: string;
  recommendations?: any;
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
    const { userPreferences, contentType } = req.body;

    // Validate input parameters
    if (!userPreferences || !contentType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: userPreferences, contentType',
      });
    }

    // Create and run the recommendation agent
    const recommendationAgent = await createRecommendationAgent();
    
    const result = await recommendationAgent.invoke({
      input: `Recommend ${contentType} YouTube Shorts content for a user with the following preferences: ${userPreferences}`,
      userPreferences,
      contentType,
    });

    // Parse the recommendations from the result
    let recommendations;
    try {
      // Try to extract JSON from the agent's response
      const jsonMatch = result.output.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
      } else {
        // If no JSON found, use the raw output
        recommendations = result.output;
      }
    } catch (parseError) {
      // If parsing fails, use the raw output
      recommendations = result.output;
    }

    return res.status(200).json({
      success: true,
      message: 'Content recommendations generated successfully',
      recommendations,
    });
  } catch (error: any) {
    console.error('Content recommendation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Content recommendation failed',
      error: error.message,
    });
  }
}
