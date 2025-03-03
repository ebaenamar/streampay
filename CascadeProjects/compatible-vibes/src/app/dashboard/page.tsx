"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SharePlaylist from "@/components/SharePlaylist";

// Demo data for the dashboard
const demoArtists = [
  { id: "1", name: "Taylor Swift", genre: "Pop", image: "https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0" },
  { id: "2", name: "The Weeknd", genre: "R&B", image: "https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb" },
  { id: "3", name: "Kendrick Lamar", genre: "Hip-Hop", image: "https://i.scdn.co/image/ab6761610000e5eb437b9e2a82505b3d93ff1022" },
  { id: "4", name: "Dua Lipa", genre: "Pop", image: "https://i.scdn.co/image/ab6761610000e5eb4c4547d332952c10c35d0b4e" },
  { id: "5", name: "Arctic Monkeys", genre: "Rock", image: "https://i.scdn.co/image/ab6761610000e5eb7da39dea0a72f581535fb11f" },
];

const demoMatches = [
  { 
    id: "1", 
    name: "Alex", 
    compatibilityScore: 92,
    image: "/demo-avatar-1.jpg",
    sharedArtists: ["Taylor Swift", "Dua Lipa"],
    sharedGenres: ["Pop", "Dance"],
  },
  { 
    id: "2", 
    name: "Jordan", 
    compatibilityScore: 87,
    image: "/demo-avatar-2.jpg",
    sharedArtists: ["The Weeknd", "Kendrick Lamar"],
    sharedGenres: ["R&B", "Hip-Hop"],
  },
  { 
    id: "3", 
    name: "Sam", 
    compatibilityScore: 81,
    image: "/demo-avatar-3.jpg",
    sharedArtists: ["Arctic Monkeys", "Dua Lipa"],
    sharedGenres: ["Rock", "Pop"],
  },
];

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("discover");
  
  useEffect(() => {
    // Redirect to signin if not authenticated
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);
  
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white">
      {/* Header */}
      <header className="bg-black/30 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">Compatible Vibes</Link>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-purple-500">
                {session?.user?.image ? (
                  <Image 
                    src={session.user.image} 
                    alt={session.user.name || "User"} 
                    width={40} 
                    height={40}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {session?.user?.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              <span>{session?.user?.name || "User"}</span>
            </div>
            
            <Link 
              href="/api/auth/signout"
              className="bg-transparent hover:bg-white/10 text-white font-bold py-2 px-4 rounded-lg border border-white/20 transition-colors duration-300"
            >
              Sign Out
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Profile Completion Banner (only for demo) */}
        {session?.demoUser && (
          <div className="bg-indigo-600/30 border border-indigo-500 rounded-lg p-4 mb-8">
            <h2 className="text-xl font-bold mb-2">Welcome to your demo account!</h2>
            <p>This is a simulated experience with pre-populated data. In a real account, you would connect with Spotify to analyze your music taste.</p>
          </div>
        )}
        
        {/* Tabs */}
        <div className="flex border-b border-white/20 mb-8">
          <button
            className={`py-2 px-4 font-medium ${activeTab === "discover" ? "border-b-2 border-purple-500" : "text-white/70 hover:text-white"}`}
            onClick={() => setActiveTab("discover")}
          >
            Discover
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === "matches" ? "border-b-2 border-purple-500" : "text-white/70 hover:text-white"}`}
            onClick={() => setActiveTab("matches")}
          >
            Matches
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === "profile" ? "border-b-2 border-purple-500" : "text-white/70 hover:text-white"}`}
            onClick={() => setActiveTab("profile")}
          >
            My Profile
          </button>
        </div>
        
        {/* Tab Content */}
        {activeTab === "discover" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Discover Potential Matches</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {demoMatches.map((match) => (
                <div key={match.id} className="bg-white/10 rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-purple-500 overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          {match.name.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{match.name}</h3>
                        <div className="flex items-center">
                          <span className="text-sm bg-green-500 text-white px-2 py-1 rounded-full">
                            {match.compatibilityScore}% Match
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm text-purple-300 mb-1">Shared Artists</h4>
                      <div className="flex flex-wrap gap-1">
                        {match.sharedArtists.map((artist) => (
                          <span key={artist} className="bg-purple-500/20 text-purple-200 text-xs px-2 py-1 rounded-full">
                            {artist}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm text-purple-300 mb-1">Shared Genres</h4>
                      <div className="flex flex-wrap gap-1">
                        {match.sharedGenres.map((genre) => (
                          <span key={genre} className="bg-indigo-500/20 text-indigo-200 text-xs px-2 py-1 rounded-full">
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">
                        Like
                      </button>
                      <button className="flex-1 bg-transparent hover:bg-white/10 text-white font-bold py-2 px-4 rounded-lg border border-white/20 transition-colors duration-300">
                        Skip
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === "matches" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Your Matches</h1>
            
            {/* Show matches if available */}
            {demoMatches.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Your Musical Connections</h2>
                  <div className="space-y-4">
                    {demoMatches.map((match) => (
                      <div key={match.id} className="bg-white/10 rounded-lg p-4 flex items-center">
                        <div className="w-16 h-16 rounded-full bg-purple-500 overflow-hidden mr-4">
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            {match.name.charAt(0)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold">{match.name}</h3>
                          <div className="flex items-center">
                            <span className="text-sm bg-green-500 text-white px-2 py-1 rounded-full">
                              {match.compatibilityScore}% Match
                            </span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {match.sharedArtists.map((artist) => (
                              <span key={artist} className="bg-purple-500/20 text-purple-200 text-xs px-2 py-1 rounded-full">
                                {artist}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button 
                          className="ml-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                          onClick={() => {
                            // In a real app, this would open a chat or profile
                            alert(`Connect with ${match.name} feature coming soon!`);
                          }}
                        >
                          Connect
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Share Playlist Component */}
                <div>
                  <SharePlaylist matchId={demoMatches[0].id} matchName={demoMatches[0].name} />
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xl mb-8">You don't have any matches yet. Start discovering potential matches to find your musical soulmates!</p>
                
                <button 
                  onClick={() => setActiveTab("discover")}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                >
                  Discover Matches
                </button>
              </div>
            )}
          </div>
        )}
        
        {activeTab === "profile" && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Your Musical Profile</h1>
            
            <div className="bg-white/10 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Top Artists</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {demoArtists.map((artist) => (
                  <div key={artist.id} className="text-center">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-2">
                      <Image 
                        src={artist.image} 
                        alt={artist.name} 
                        width={96} 
                        height={96}
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-medium">{artist.name}</h3>
                    <p className="text-sm text-purple-300">{artist.genre}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Top Genres</h2>
              
              <div className="flex flex-wrap gap-2">
                <span className="bg-purple-500/20 text-purple-200 px-3 py-2 rounded-full text-sm">Pop</span>
                <span className="bg-purple-500/20 text-purple-200 px-3 py-2 rounded-full text-sm">R&B</span>
                <span className="bg-purple-500/20 text-purple-200 px-3 py-2 rounded-full text-sm">Hip-Hop</span>
                <span className="bg-purple-500/20 text-purple-200 px-3 py-2 rounded-full text-sm">Rock</span>
                <span className="bg-purple-500/20 text-purple-200 px-3 py-2 rounded-full text-sm">Dance</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
