import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getTopArtists, setAccessToken } from '@/services/spotify';

// Demo data for top artists
const demoTopArtists = [
  {
    id: '06HL4z0CvFAxyc27GXpf02',
    name: 'Taylor Swift',
    type: 'artist',
    genres: ['pop', 'pop dance'],
    popularity: 100,
    images: [{ url: 'https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0' }],
    external_urls: { spotify: 'https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02' },
  },
  {
    id: '1Xyo4u8uXC1ZmMpatF05PJ',
    name: 'The Weeknd',
    type: 'artist',
    genres: ['canadian contemporary r&b', 'canadian pop', 'pop'],
    popularity: 96,
    images: [{ url: 'https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb' }],
    external_urls: { spotify: 'https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05PJ' },
  },
  {
    id: '2YZyLoL8N0Wb9xBt1NhZWg',
    name: 'Kendrick Lamar',
    type: 'artist',
    genres: ['conscious hip hop', 'hip hop', 'rap', 'west coast rap'],
    popularity: 89,
    images: [{ url: 'https://i.scdn.co/image/ab6761610000e5eb437b9e2a82505b3d93ff1022' }],
    external_urls: { spotify: 'https://open.spotify.com/artist/2YZyLoL8N0Wb9xBt1NhZWg' },
  },
  {
    id: '6M2wZ9GZgrQXHCFfjv46we',
    name: 'Dua Lipa',
    type: 'artist',
    genres: ['dance pop', 'pop', 'uk pop'],
    popularity: 91,
    images: [{ url: 'https://i.scdn.co/image/ab6761610000e5eb4c4547d332952c10c35d0b4e' }],
    external_urls: { spotify: 'https://open.spotify.com/artist/6M2wZ9GZgrQXHCFfjv46we' },
  },
  {
    id: '7Ln80lUS6He07XvHI8qqHH',
    name: 'Arctic Monkeys',
    type: 'artist',
    genres: ['garage rock', 'modern rock', 'permanent wave', 'rock', 'sheffield indie'],
    popularity: 85,
    images: [{ url: 'https://i.scdn.co/image/ab6761610000e5eb7da39dea0a72f581535fb11f' }],
    external_urls: { spotify: 'https://open.spotify.com/artist/7Ln80lUS6He07XvHI8qqHH' },
  },
];

/**
 * API route to fetch the current user's top artists from Spotify
 */
export async function GET(req: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = req.nextUrl.searchParams;
    const timeRange = searchParams.get('time_range') || 'medium_term';
    const limit = parseInt(searchParams.get('limit') || '10', 10);

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
      return NextResponse.json(demoTopArtists.slice(0, limit));
    }

    // Set the access token for the Spotify API
    setAccessToken(session.accessToken);

    // Fetch the user's top artists
    const topArtists = await getTopArtists(timeRange, limit);

    // Return the top artists
    return NextResponse.json(topArtists);
  } catch (error) {
    console.error('Error in top-artists route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top artists' },
      { status: 500 }
    );
  }
}
