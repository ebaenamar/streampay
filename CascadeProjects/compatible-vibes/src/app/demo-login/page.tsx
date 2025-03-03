"use client";

import { useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DemoLogin() {
  const router = useRouter();

  useEffect(() => {
    // Automatically sign in with demo credentials
    const handleDemoLogin = async () => {
      try {
        await signIn("credentials", {
          username: "demo",
          password: "demo123",
          redirect: true,
          callbackUrl: "/dashboard",
        });
      } catch (error) {
        console.error("Demo login failed:", error);
        router.push("/signin?error=DemoLoginFailed");
      }
    };

    handleDemoLogin();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 flex flex-col items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Logging in...</h1>
        <p className="text-purple-200 mb-8">Please wait while we log you in with the demo account</p>
        
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      </div>
    </div>
  );
}
