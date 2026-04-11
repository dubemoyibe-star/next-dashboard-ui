"use client";

import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react"


const LoginPage = () => {

  const [ loading, setLoading ] = useState(false);
  const { isLoaded , isSignedIn, user } = useUser();
  const router = useRouter();
  const role = user?.publicMetadata?.role as string | undefined;

  useEffect(() => {

    if(role) {
      router.push(`/${role}`);
      setLoading(true);
      
    }
  }, [user, router, isLoaded ]);

if (!isLoaded) {
  return (
    <div className="mt-20 w-full max-w-md mx-auto animate-pulse">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-10 pt-12 pb-8 text-center space-y-4">
          <div className="w-16 h-16 bg-gray-200 rounded-2xl mx-auto" />
          <div className="h-6 w-40 bg-gray-200 rounded mx-auto" />
          <div className="h-4 w-56 bg-gray-200 rounded mx-auto" />
        </div>

        {/* Form */}
        <div className="px-10 pb-10 space-y-4">
          <div className="h-10 w-full bg-gray-200 rounded-lg" />
          <div className="h-10 w-full bg-gray-200 rounded-lg" />
          <div className="h-10 w-full bg-gray-200 rounded-lg" />
          <div className="h-10 w-full bg-gray-300 rounded-lg mt-2" />
        </div>

        {/* Footer */}
        <div className="px-10 pb-8 pt-6 border-t border-gray-100">
          <div className="h-3 w-48 bg-gray-200 rounded mx-auto" />
        </div>

      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md">
        {/* Main card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Header section */}
          <div className="px-10 pt-12 pb-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-50 rounded-2xl p-5">
                <Image
                  src="/logo.png"
                  alt="CrestWood Logo"
                  width={56}
                  height={56}
                  className="opacity-90"
                />
              </div>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Clerk SignIn component container */}
          <div className="px-10 pb-10">
            <div className="clerk-signin-wrapper w-full">
              {loading ? (
                <div className="text-center flex gap-2 items-center justify-center">
                  <Loader className=" text-gray-500 animate-spin" />
                  <p>Redirecting to {role}'s page...</p>
                </div>
              ) : (
                <SignIn
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none bg-transparent border-0",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton: "border border-gray-200 rounded-lg py-2.5 hover:bg-gray-50 transition-colors duration-150",
                    socialButtonsBlockButtonText: "font-medium text-gray-700 text-sm",
                    dividerRow: "my-6",
                    dividerLine: "bg-gray-200",
                    dividerText: "text-gray-400 text-xs font-medium uppercase tracking-wider",
                    formFieldLabel: "text-gray-700 font-medium text-sm mb-1.5",
                    formFieldInput: "w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-150",
                    formFieldInputShowPasswordButton: "text-gray-400 hover:text-gray-600",
                    formButtonPrimary: "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-150 text-sm text-center",
                    footerActionLink: "text-blue-600 hover:text-blue-700 font-medium text-sm text-center",
                    footerActionText: "text-gray-500 text-sm",
                    identityPreviewText: "text-gray-600 text-sm",
                    identityPreviewEditButton: "text-blue-600 hover:text-blue-700 text-sm",
                    formFieldAction: "text-blue-600 hover:text-blue-700 text-sm font-medium",
                    formFieldHintText: "text-gray-400 text-xs",
                    formFieldSuccessText: "text-green-600 text-xs",
                    formFieldErrorText: "text-red-600 text-xs",
                    alert: "bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm",
                    alertText: "text-red-700 text-sm",
                  },
                  variables: {
                    colorPrimary: "#2563eb",
                    colorBackground: "#ffffff",
                    colorDanger: "#dc2626",
                    colorSuccess: "#16a34a",
                    borderRadius: "0.5rem",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.875rem",
                  },
                }}
              />
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-10 pb-8 text-center border-t border-gray-100 pt-6">
            <p className="text-xs text-gray-400">
              © 2026 CrestWood School. All rights reserved.
            </p>
          </div>
        </div>

        {/* Help link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <a href="https://x.com/oy32665" className="text-blue-600 hover:text-blue-700 font-medium">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
