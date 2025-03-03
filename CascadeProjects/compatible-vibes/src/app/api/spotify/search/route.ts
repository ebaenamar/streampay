import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import SpotifyWebApi from 'spotify-web-api-node';

/**
 * API route to search Spotify tracks, artists, albums, or playlists
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

    // Get query parameters
    const url = new URL(req.url);
    const query = url.searchParams.get('q');
    const type = url.searchParams.get('type') || 'track';
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);

    // Validate the request
    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    // Handle demo user
    if (session.demoUser) {
      // Return mock data for demo users
      const mockTracks = [
        {
          id: '1',
          name: 'Blinding Lights',
          artists: [{ name: 'The Weeknd' }],
          album: { 
            name: 'After Hours', 
            images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273ef12a4e9d43ebe7f5a8399a9' }] 
          },
          uri: 'spotify:track:0VjIjW4GlUZAMYd2vXMi3b'
        },
        {
          id: '2',
          name: 'Levitating',
          artists: [{ name: 'Dua Lipa' }],
          album: { 
            name: 'Future Nostalgia', 
            images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273bd26ede1ae69327010d49946' }] 
          },
          uri: 'spotify:track:39LLxExYz6ewLAcYrzQQyP'
        },
        {
          id: '3',
          name: 'Cruel Summer',
          artists: [{ name: 'Taylor Swift' }],
          album: { 
            name: 'Lover', 
            images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647' }] 
          },
          uri: 'spotify:track:1BxfuPKGuaTgP7aM0Bbdwr'
        },
        {
          id: '4',
          name: 'As It Was',
          artists: [{ name: 'Harry Styles' }],
          album: { 
            name: "Harry's House", 
            images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273b46f74097655d7f353caab14' }] 
          },
          uri: 'spotify:track:4LRPiXqCikLlN15c3yImP7'
        },
        {
          id: '5',
          name: 'Flowers',
          artists: [{ name: 'Miley Cyrus' }],
          album: { 
            name: 'Endless Summer Vacation', 
            images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273a46b2ca6b3e338d5d36a04a4' }] 
          },
          uri: 'spotify:track:0yLdNVWF3Srea0uzk55zFn'
        }
      ];

      return NextResponse.json({
        tracks: mockTracks.filter(track => 
          track.name.toLowerCase().includes(query.toLowerCase()) ||
          track.artists.some(artist => artist.name.toLowerCase().includes(query.toLowerCase()))
        ).slice(0, limit)
      });
    }

    // Initialize Spotify API with the user's access token
    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });
    spotifyApi.setAccessToken(session.accessToken);

    // Search Spotify
    const response = await spotifyApi.search(query, [type as any], { limit });

    // Format the response based on the type
    let formattedResponse: any = {};
    
    if (type.includes('track')) {
      formattedResponse.tracks = response.body.tracks?.items;
    }
    
    if (type.includes('artist')) {
      formattedResponse.artists = response.body.artists?.items;
    }
    
    if (type.includes('album')) {
      formattedResponse.albums = response.body.albums?.items;
    }
    
    if (type.includes('playlist')) {
      formattedResponse.playlists = response.body.playlists?.items;
    }

    return NextResponse.json(formattedResponse);
  } catch (error: any) {
    console.error('Error searching Spotify:', error);
    return NextResponse.json(
      { 
        error: 'Failed to search Spotify',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}
