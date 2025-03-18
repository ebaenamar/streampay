import Link from "next/link";
import Image from "next/image";
import ChatInterface from "@/components/chat/chat-interface";
import UberEatsIntegration from "@/components/ubereats/ubereats-integration";
import HealthScore from "@/components/scoring/health-score";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">NutriChat</h1>
            <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Beta</span>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="text-gray-600 hover:text-primary font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-gray-600 hover:text-primary font-medium">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your AI-Powered Dietary Assistant</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get personalized dietary recommendations, connect with food delivery services,
            and track your progress with our gamified health scoring system.
          </p>
        </div>

        <div className="space-y-12">
          <section>
            <h3 className="text-2xl font-semibold mb-6">Chat with NutriChat</h3>
            <ChatInterface />
          </section>

          <section>
            <h3 className="text-2xl font-semibold mb-6">Food Delivery Integration</h3>
            <UberEatsIntegration />
          </section>

          <section>
            <h3 className="text-2xl font-semibold mb-6">Your Health Progress</h3>
            <HealthScore />
          </section>
        </div>
      </div>

      <footer className="bg-white border-t mt-16 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold text-primary">NutriChat</h2>
              <p className="text-sm text-gray-600 mt-1">
                Your AI-powered dietary recommendation assistant
              </p>
            </div>
            <div className="flex space-x-6">
              <Link href="/" className="text-sm text-gray-600 hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/" className="text-sm text-gray-600 hover:text-primary">
                Terms of Service
              </Link>
              <Link href="/" className="text-sm text-gray-600 hover:text-primary">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} NutriChat. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
