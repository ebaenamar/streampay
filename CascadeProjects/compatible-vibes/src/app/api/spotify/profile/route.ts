import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getUserProfile, setAccessToken } from '@/services/spotify';

/**
 * API route to fetch the current user's Spotify profile
 */
export async function GET(req: NextRequest) {
  try {
    // Get the session
    const session = await getServerSession();

    // Check if the user is authenticated
    if (!session || !session.accessToken) {
      return NextResponse.json(
        { error: 'You must be logged in with Spotify to access this endpoint' },
        { status: 401 }
      );
    }

    // Handle demo user
    if (session.demoUser) {
      // Return mock data for demo users
      return NextResponse.json({
        id: 'demo-user',
        display_name: 'Demo User',
        email: 'demo@compatiblevibes.com',
        images: [{ url: '/demo-avatar.jpg' }],
        country: 'US',
        product: 'premium',
        followers: { total: 42 },
        external_urls: { spotify: 'https://open.spotify.com/' },
      });
    }

    // Set the access token for the Spotify API
    setAccessToken(session.accessToken);

    // Fetch the user's profile
    const profile = await getUserProfile();

    // Return the profile
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error in profile route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Spotify profile' },
      { status: 500 }
    );
  }
}
