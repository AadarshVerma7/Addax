"use client";

import Link from "next/link";
import { ReactNode, useState, useEffect } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { googleAuth } from "../../lib/googleAuthService";
import { useToast } from "../ui/ToastContext";

declare global {
  interface Window {
    google: any;
  }
}

interface AuthLayoutProps {
  title: string;
  children: ReactNode;
  bottomText: string;
  bottomLinkText: string;
  bottomLinkHref: string;
}

export default function AuthLayout({
  title,
  children,
  bottomText,
  bottomLinkText,
  bottomLinkHref,
}: AuthLayoutProps) {
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const handleCredentialResponse = async (response: any) => {
    setGoogleLoading(true);
    try {
      const res = await googleAuth(response.credential);
      const mappedUser = {
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        image: res.user.image || null,
        provider: "GOOGLE",
      };
      login(res.token, mappedUser);
      router.push("/videosummary");
    } catch (err: any) {
      showToast(err.message || "Google authentication failed. Please try again.", "error");
    } finally {
      setGoogleLoading(false);
    }
  };

  const initializeGoogleSignIn = () => {
    if (typeof window !== "undefined" && window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-btn"),
        {
          theme: "outline",
          size: "large",
          width: 320,
          text: "continue_with",
          shape: "rectangular",
        }
      );
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.google) {
      initializeGoogleSignIn();
    }
  }, []);

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        onLoad={initializeGoogleSignIn}
        strategy="afterInteractive"
      />
      <main className="relative h-screen bg-fixed bg-linear-to-br from-[#000000] via-[#1a3869] to-[#a3e2de] flex items-center justify-center overflow-hidden">
        {/* Card */}
        <div className="relative z-10 w-[92%] max-w-4xl overflow-hidden rounded-2xl p-2 bg-[#F8F7F4] shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
          <div className="grid md:grid-cols-[48%_52%]">
            {/* Left Image */}
            <div className="hidden md:flex items-center justify-center p-3 bg-black rounded-l-xl">
              <img
                src="/logosvg.svg"
                alt="Artwork"
                className="h-56 w-auto rounded-2xl object-contain"
              />
            </div>

            {/* Right Side */}
            <div className="flex flex-col justify-between px-8 py-6 lg:px-10">
              <div>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm text-zinc-700 hover:text-black"
                >
                  ← Back
                </Link>

                <div className="mt-6">
                  <p className="text-lg text-zinc-900">{title}</p>
                  <h1
                    className="mt-1 text-3xl leading-[0.95] text-zinc-900"
                    style={{
                      fontFamily: "Georgia, Cambria, 'Times New Roman', serif",
                    }}
                  >
                    Where Knowledge
                    <br />
                    Comes Alive
                  </h1>
                </div>

                {children}

                <div className="relative mt-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-[#F8F7F4] px-2 text-zinc-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-center w-full min-h-[44px]">
                  {googleLoading ? (
                    <div className="flex items-center justify-center gap-2 text-sm text-zinc-600">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-500 border-t-transparent" />
                      Signing in with Google...
                    </div>
                  ) : (
                    <div id="google-signin-btn" />
                  )}
                </div>

                <p className="mt-5 text-sm text-zinc-600">
                  {bottomText}{" "}
                  <Link
                    href={bottomLinkHref}
                    className="font-medium text-indigo-600 hover:underline"
                  >
                    {bottomLinkText}
                  </Link>
                </p>
              </div>

              {/* Bottom Branding */}
              <div className="mt-8 flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <div className="h-7 w-7 rounded-full bg-black" />
                    <div className="-ml-3 h-7 w-7 rounded-full bg-black/90" />
                  </div>
                  <span className="text-2xl font-medium tracking-tight">
                    Addax
                  </span>
                </div>
                <p className="max-w-[200px] text-xs leading-5 text-zinc-700">
                  Shared Knowledge for a Responsible AI Future.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

