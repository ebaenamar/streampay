"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  uri: string;
}

interface SharePlaylistProps {
  matchId: string;
  matchName: string;
}

export default function SharePlaylist({ matchId, matchName }: SharePlaylistProps) {
  const { data: session } = useSession();
  const [playlistName, setPlaylistName] = useState(`Vibes for ${matchName}`);
  const [playlistDescription, setPlaylistDescription] = useState(`A playlist created for ${matchName} via Compatible Vibes`);
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Search for tracks
  const searchTracks = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setMessage({ text: "", type: "" });
    
    try {
      // For demo users, return mock data
      if (session?.demoUser) {
        setSearchResults([
          {
            id: "1",
            name: "Blinding Lights",
            artists: [{ name: "The Weeknd" }],
            album: { 
              name: "After Hours", 
              images: [{ url: "https://i.scdn.co/image/ab67616d0000b273ef12a4e9d43ebe7f5a8399a9" }] 
            },
            uri: "spotify:track:0VjIjW4GlUZAMYd2vXMi3b"
          },
          {
            id: "2",
            name: "Levitating",
            artists: [{ name: "Dua Lipa" }],
            album: { 
              name: "Future Nostalgia", 
              images: [{ url: "https://i.scdn.co/image/ab67616d0000b273bd26ede1ae69327010d49946" }] 
            },
            uri: "spotify:track:39LLxExYz6ewLAcYrzQQyP"
          },
          {
            id: "3",
            name: "Cruel Summer",
            artists: [{ name: "Taylor Swift" }],
            album: { 
              name: "Lover", 
              images: [{ url: "https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647" }] 
            },
            uri: "spotify:track:1BxfuPKGuaTgP7aM0Bbdwr"
          }
        ]);
        setIsLoading(false);
        return;
      }
      
      // Real API call for Spotify users
      const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=10`);
      
      if (!response.ok) {
        throw new Error("Failed to search tracks");
      }
      
      const data = await response.json();
      setSearchResults(data.tracks || []);
    } catch (error) {
      console.error("Error searching tracks:", error);
      setMessage({ 
        text: "Failed to search tracks. Please try again.", 
        type: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add track to selection
  const addTrack = (track: Track) => {
    if (!selectedTracks.some(t => t.id === track.id)) {
      setSelectedTracks([...selectedTracks, track]);
    }
  };

  // Remove track from selection
  const removeTrack = (trackId: string) => {
    setSelectedTracks(selectedTracks.filter(track => track.id !== trackId));
  };

  // Create and share playlist
  const createPlaylist = async () => {
    if (selectedTracks.length === 0) {
      setMessage({ 
        text: "Please select at least one track for the playlist.", 
        type: "error" 
      });
      return;
    }
    
    setIsCreating(true);
    setMessage({ text: "", type: "" });
    
    try {
      const response = await fetch("/api/spotify/create-playlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: playlistName,
          description: playlistDescription,
          trackUris: selectedTracks.map(track => track.uri),
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create playlist");
      }
      
      const data = await response.json();
      
      // Now share the playlist with the match (in a real app, this would send a notification)
      // For demo purposes, we'll just show a success message
      setMessage({ 
        text: `Playlist "${data.name}" created and shared with ${matchName} successfully!`, 
        type: "success" 
      });
      
      // Reset the form
      setSelectedTracks([]);
      setSearchQuery("");
      setSearchResults([]);
    } catch (error) {
      console.error("Error creating playlist:", error);
      setMessage({ 
        text: "Failed to create and share playlist. Please try again.", 
        type: "error" 
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-white/10 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Share a Playlist with {matchName}</h2>
      
      {/* Playlist details */}
      <div className="mb-6">
        <div className="mb-4">
          <label htmlFor="playlistName" className="block text-sm font-medium mb-1">
            Playlist Name
          </label>
          <input
            id="playlistName"
            type="text"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            className="w-full bg-white/5 border border-purple-300/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="playlistDescription" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="playlistDescription"
            value={playlistDescription}
            onChange={(e) => setPlaylistDescription(e.target.value)}
            className="w-full bg-white/5 border border-purple-300/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={2}
          />
        </div>
      </div>
      
      {/* Search for tracks */}
      <div className="mb-6">
        <label htmlFor="searchQuery" className="block text-sm font-medium mb-1">
          Search for Tracks
        </label>
        <div className="flex gap-2">
          <input
            id="searchQuery"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchTracks()}
            placeholder="Search by song or artist name"
            className="flex-1 bg-white/5 border border-purple-300/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={searchTracks}
            disabled={isLoading || !searchQuery.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>
      
      {/* Search results */}
      {searchResults.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Search Results</h3>
          <div className="max-h-64 overflow-y-auto bg-black/20 rounded-lg">
            {searchResults.map((track) => (
              <div 
                key={track.id} 
                className="flex items-center p-2 hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => addTrack(track)}
              >
                <div className="w-10 h-10 relative flex-shrink-0 mr-3">
                  <Image
                    src={track.album.images[0]?.url || "/album-placeholder.jpg"}
                    alt={track.album.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{track.name}</p>
                  <p className="text-sm text-purple-300 truncate">
                    {track.artists.map(a => a.name).join(", ")}
                  </p>
                </div>
                <button 
                  className="ml-2 p-1 rounded-full bg-purple-500 hover:bg-purple-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    addTrack(track);
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Selected tracks */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Selected Tracks ({selectedTracks.length})</h3>
        {selectedTracks.length === 0 ? (
          <p className="text-purple-300 italic">No tracks selected yet. Search and add tracks above.</p>
        ) : (
          <div className="max-h-64 overflow-y-auto bg-black/20 rounded-lg">
            {selectedTracks.map((track) => (
              <div key={track.id} className="flex items-center p-2 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 relative flex-shrink-0 mr-3">
                  <Image
                    src={track.album.images[0]?.url || "/album-placeholder.jpg"}
                    alt={track.album.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{track.name}</p>
                  <p className="text-sm text-purple-300 truncate">
                    {track.artists.map(a => a.name).join(", ")}
                  </p>
                </div>
                <button 
                  className="ml-2 p-1 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                  onClick={() => removeTrack(track.id)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Status message */}
      {message.text && (
        <div className={`mb-6 p-3 rounded-lg ${message.type === "error" ? "bg-red-500/20 border border-red-500" : "bg-green-500/20 border border-green-500"}`}>
          {message.text}
        </div>
      )}
      
      {/* Create button */}
      <button
        onClick={createPlaylist}
        disabled={isCreating || selectedTracks.length === 0}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50"
      >
        {isCreating ? "Creating Playlist..." : "Create & Share Playlist"}
      </button>
    </div>
  );
}
