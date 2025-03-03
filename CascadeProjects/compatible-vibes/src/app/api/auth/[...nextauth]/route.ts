import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

// Spotify scopes for API access - these define what our app can do with the user's Spotify account
const scopes = [
  "user-read-email",         // Read user's email
  "user-read-private",       // Read user's subscription details
  "user-top-read",           // Read user's top artists and tracks
  "user-read-recently-played", // Read user's recently played tracks
  "user-library-read",       // Read user's saved tracks and albums
  "playlist-read-private",   // Read user's private playlists
  "playlist-read-collaborative" // Read user's collaborative playlists
].join(" ");

// URL to redirect to after Spotify authentication
const spotifyAuthUrl = `https://accounts.spotify.com/authorize?scope=${encodeURIComponent(scopes)}`;

// Helper function to refresh an expired token
async function refreshAccessToken(token: JWT) {
  try {
    const url = "https://accounts.spotify.com/api/token";
    const basicAuth = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64");
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      // Fall back to old refresh token, but use new one if it's provided
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, 
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

// For demo purposes, we're using a simple credentials provider with a fixed demo account
// and a Spotify provider for real authentication
const handler = NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID || "",
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
      authorization: spotifyAuthUrl,
    }),
    CredentialsProvider({
      name: "Demo Account",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // This is a demo account, so we're just checking for hardcoded credentials
        if (
          credentials?.username === "demo" &&
          credentials?.password === "demo123"
        ) {
          return {
            id: "demo-user",
            name: "Demo User",
            email: "demo@compatiblevibes.com",
            image: "/demo-avatar.jpg",
            // Add demo user data for the application
            demoUser: true,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // Initial sign in
      if (account && user) {
        // Add demo user flag if applicable
        if (user.demoUser) {
          token.demoUser = true;
          return token;
        }
        
        // For Spotify login
        if (account.provider === "spotify") {
          return {
            ...token,
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            accessTokenExpires: account.expires_at ? account.expires_at * 1000 : 0,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
            },
          };
        }
      }

      // Return previous token if the access token has not expired yet
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Access token has expired, try to refresh it
      // Only attempt to refresh if we have a refresh token and it's not a demo user
      if (token.refreshToken && !token.demoUser) {
        return refreshAccessToken(token);
      }
      
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken;
      session.error = token.error;
      session.demoUser = token.demoUser;
      
      // If we have user info in the token, add it to the session
      if (token.user) {
        session.user = token.user;
      }
      
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour
  },
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
