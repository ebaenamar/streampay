import SpotifyWebApi from 'spotify-web-api-node';

// Initialize the Spotify API with client credentials
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/api/auth/callback/spotify` : 'http://localhost:3000/api/auth/callback/spotify',
});

/**
 * Sets the access token for the Spotify API instance
 * @param accessToken - The access token to set
 */
export const setAccessToken = (accessToken: string) => {
  spotifyApi.setAccessToken(accessToken);
};

/**
 * Fetches the current user's profile from Spotify
 * @returns The user's Spotify profile
 */
export const getUserProfile = async () => {
  try {
    const response = await spotifyApi.getMe();
    return response.body;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

/**
 * Fetches the current user's top artists from Spotify
 * @param timeRange - The time range to fetch top artists for (short_term, medium_term, long_term)
 * @param limit - The number of artists to fetch (default: 10)
 * @returns The user's top artists
 */
export const getTopArtists = async (timeRange = 'medium_term', limit = 10) => {
  try {
    const response = await spotifyApi.getMyTopArtists({
      time_range: timeRange,
      limit,
    });
    return response.body.items;
  } catch (error) {
    console.error('Error fetching top artists:', error);
    throw error;
  }
};

/**
 * Fetches the current user's top tracks from Spotify
 * @param timeRange - The time range to fetch top tracks for (short_term, medium_term, long_term)
 * @param limit - The number of tracks to fetch (default: 10)
 * @returns The user's top tracks
 */
export const getTopTracks = async (timeRange = 'medium_term', limit = 10) => {
  try {
    const response = await spotifyApi.getMyTopTracks({
      time_range: timeRange,
      limit,
    });
    return response.body.items;
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    throw error;
  }
};

/**
 * Fetches the current user's recently played tracks from Spotify
 * @param limit - The number of tracks to fetch (default: 20)
 * @returns The user's recently played tracks
 */
export const getRecentlyPlayed = async (limit = 20) => {
  try {
    const response = await spotifyApi.getMyRecentlyPlayedTracks({
      limit,
    });
    return response.body.items;
  } catch (error) {
    console.error('Error fetching recently played tracks:', error);
    throw error;
  }
};

/**
 * Fetches the current user's saved tracks from Spotify
 * @param limit - The number of tracks to fetch (default: 20)
 * @returns The user's saved tracks
 */
export const getSavedTracks = async (limit = 20) => {
  try {
    const response = await spotifyApi.getMySavedTracks({
      limit,
    });
    return response.body.items;
  } catch (error) {
    console.error('Error fetching saved tracks:', error);
    throw error;
  }
};

/**
 * Fetches recommendations based on seed artists and tracks
 * @param seedArtists - Array of artist IDs to use as seeds
 * @param seedTracks - Array of track IDs to use as seeds
 * @param limit - The number of recommendations to fetch (default: 10)
 * @returns Recommended tracks
 */
export const getRecommendations = async (
  seedArtists: string[] = [],
  seedTracks: string[] = [],
  limit = 10
) => {
  try {
    const response = await spotifyApi.getRecommendations({
      seed_artists: seedArtists.slice(0, 2), // Spotify allows max 5 seed values in total
      seed_tracks: seedTracks.slice(0, 3),
      limit,
    });
    return response.body.tracks;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};

/**
 * Fetches an artist's details from Spotify
 * @param artistId - The Spotify ID of the artist
 * @returns The artist's details
 */
export const getArtist = async (artistId: string) => {
  try {
    const response = await spotifyApi.getArtist(artistId);
    return response.body;
  } catch (error) {
    console.error(`Error fetching artist ${artistId}:`, error);
    throw error;
  }
};

/**
 * Fetches a track's details from Spotify
 * @param trackId - The Spotify ID of the track
 * @returns The track's details
 */
export const getTrack = async (trackId: string) => {
  try {
    const response = await spotifyApi.getTrack(trackId);
    return response.body;
  } catch (error) {
    console.error(`Error fetching track ${trackId}:`, error);
    throw error;
  }
};

// Export the Spotify API instance for direct use if needed
export default spotifyApi;
