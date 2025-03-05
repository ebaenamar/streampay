import type { NextApiRequest, NextApiResponse } from 'next';
import { NewClient, AddressFromHex } from '@radiustechsystems/sdk';

type ResponseData = {
  success: boolean;
  message: string;
  balance?: string;
  receipt?: any;
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
    const { userAddress, creatorAddress, amount, txHash } = req.body;

    // Validate input parameters
    if (!userAddress || !creatorAddress || !amount || !txHash) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: userAddress, creatorAddress, amount, txHash',
      });
    }

    // Initialize Radius client
    const endpoint = process.env.RADIUS_ENDPOINT || 'https://testnet.radiustech.xyz';
    const client = await NewClient(endpoint);

    // Verify the transaction
    const receipt = await client.getTransactionReceipt(txHash);
    
    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    // Get user's current balance
    const userAddressObj = AddressFromHex(userAddress);
    const balance = await client.getBalance(userAddressObj);

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      balance: balance.toString(),
      receipt,
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return res.status(500).json({
      success: false,
      message: `Payment verification failed: ${error.message}`,
    });
  }
}
