"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import VideoSummaryMain from "@/components/videosummary/VideoSummaryMain";
import {Loader} from "lucide-react"
// 1. Import the useToast hook (adjust the path to match where you saved ToastContext.tsx)
import { useToast } from "@/components/ui/ToastContext"; 

export default function VideoSummary() {
  const { token, isLoading } = useAuth();
  const router = useRouter();
  
  // 2. Initialize the toast hook
  const { showToast } = useToast(); 

  useEffect(() => {
    if (!isLoading && !token) {
      // 3. Trigger the warning popup before redirecting
      showToast("Please login to access the Video Summary.", "warning");
      
      router.replace("/auth/login");
    }
  }, [isLoading, token, router, showToast]); // Added showToast to dependency array

  if (isLoading) {
    return (
      <div className="flex h-screen items-center gap-2 text-white justify-center bg-black">
        <Loader className="animate-spin text-4xl"/>
        Loading...
      </div>
    ); 
  }

  if (!token) {
    return null; // Redirect is happening, render nothing
  }

  return (
    <div className="h-screen bg-black">
      <VideoSummaryMain />
    </div>
  );
}