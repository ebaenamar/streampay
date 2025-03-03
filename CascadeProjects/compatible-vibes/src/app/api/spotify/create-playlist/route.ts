import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import SpotifyWebApi from 'spotify-web-api-node';

/**
 * API route to create a new playlist on Spotify
 */
export async function POST(req: NextRequest) {
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

    // Parse the request body
    const { name, description, trackUris } = await req.json();

    // Validate the request
    if (!name || !Array.isArray(trackUris)) {
      return NextResponse.json(
        { error: 'Invalid request. Name and trackUris array are required.' },
        { status: 400 }
      );
    }

    // Handle demo user
    if (session.demoUser) {
      // Return mock data for demo users
      return NextResponse.json({
        id: 'demo-playlist-id',
        name,
        description,
        external_urls: { spotify: 'https://open.spotify.com/playlist/demo' },
        tracks: { total: trackUris.length },
        images: [{ url: '/playlist-cover.jpg' }],
        success: true,
        message: 'Demo playlist created successfully!',
      });
    }

    // Initialize Spotify API with the user's access token
    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });
    spotifyApi.setAccessToken(session.accessToken);

    // Get the user's Spotify ID
    const userProfile = await spotifyApi.getMe();
    const userId = userProfile.body.id;

    // Create a new playlist
    const playlist = await spotifyApi.createPlaylist(userId, name, {
      description,
      public: false,
    });

    // Add tracks to the playlist
    if (trackUris.length > 0) {
      await spotifyApi.addTracksToPlaylist(playlist.body.id, trackUris);
    }

    // Return the created playlist
    return NextResponse.json({
      ...playlist.body,
      success: true,
      message: 'Playlist created successfully!',
    });
  } catch (error: any) {
    console.error('Error creating playlist:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create playlist',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}
