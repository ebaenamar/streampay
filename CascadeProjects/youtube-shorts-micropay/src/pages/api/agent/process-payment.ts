import type { NextApiRequest, NextApiResponse } from 'next';
import { createPaymentAgent } from '@/utils/langchainAgents';

type ResponseData = {
  success: boolean;
  message: string;
  result?: any;
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
    const { userPrivateKey, creatorAddress, amount, contentId } = req.body;

    // Validate input parameters
    if (!userPrivateKey || !creatorAddress || !amount || !contentId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: userPrivateKey, creatorAddress, amount, contentId',
      });
    }

    // Create and run the payment agent
    const paymentAgent = await createPaymentAgent();
    
    const result = await paymentAgent.invoke({
      input: `Process a micropayment of ${amount} from the user to the creator at address ${creatorAddress} for content ID ${contentId}.`,
      userPrivateKey,
      creatorAddress,
      amount,
      contentId,
    });

    return res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      result,
    });
  } catch (error: any) {
    console.error('Payment processing error:', error);
    return res.status(500).json({
      success: false,
      message: 'Payment processing failed',
      error: error.message,
    });
  }
}
