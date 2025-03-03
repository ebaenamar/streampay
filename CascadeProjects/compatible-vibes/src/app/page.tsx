import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">Find Your Musical Soulmates</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl">
          Connect with people who share your musical taste. Discover new music and build meaningful relationships based on the universal language of music.
        </p>
        
        <div className="relative w-full max-w-md h-64 mb-12">
          <Image 
            src="/music-connection.svg" 
            alt="Music Connection Illustration" 
            fill
            className="object-contain"
            priority
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Link 
            href="/api/auth/signin"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 flex items-center justify-center"
          >
            <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Connect with Spotify
          </Link>
          <Link 
            href="/demo-login"
            className="bg-transparent hover:bg-white/10 text-white font-bold py-3 px-8 rounded-full border-2 border-white transition-colors duration-300"
          >
            Try Demo Account
          </Link>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">How Compatible Vibes Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 p-6 rounded-lg">
            <div className="text-4xl mb-4">🎵</div>
            <h3 className="text-xl font-bold mb-2">Connect Your Music</h3>
            <p>Link your Spotify account to analyze your listening habits and create your musical profile.</p>
          </div>
          
          <div className="bg-white/10 p-6 rounded-lg">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold mb-2">Find Your Matches</h3>
            <p>Discover people with compatible musical tastes based on shared artists, genres, and songs.</p>
          </div>
          
          <div className="bg-white/10 p-6 rounded-lg">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-bold mb-2">Connect & Discover</h3>
            <p>Chat with your matches, share songs, and discover new artists through your connections.</p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-black/30 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Compatible Vibes. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
