"use client";

import VideoPlayer from "@/components/ui/video-player";
import {Brain, Clapperboard, ArrowDown} from "lucide-react";
import {MortyLogo, LearnXYZLogo} from "@/components/icons";

import React, {useState, useEffect} from "react";
import {Button} from "@/components/ui/button";

import {ParticleButton} from "./a-button";
import {motion} from "framer-motion";
import {db, app} from "@/config/firebase";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

// Helper function to get user's IP address
const getUserIP = async () => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error fetching IP:", error);
    return "unknown";
  }
};

// Helper function to get a unique identifier for the user
const getUniqueId = async () => {
  const ip = await getUserIP();
  const storedId = localStorage.getItem("treecard-visitor-id");

  if (storedId) {
    return storedId;
  }

  const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
  localStorage.setItem("treecard-visitor-id", id);
  return id;
};

// Helper function for Firebase logging
const logToFirebase = async (collectionPath: string, data: any) => {
  try {
    console.log("Attempting to write to Firebase...");
    const uniqueId = await getUniqueId();
    const ip = await getUserIP();
    const docRef = doc(db, collectionPath, uniqueId);

    await setDoc(
      docRef,
      {
        ...data,
        ipAddress: ip,
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        url: window.location.href,
        lastUpdated: serverTimestamp(),
      },
      {merge: true}
    );

    console.log("Successfully wrote to Firebase. Document ID:", uniqueId);
    return docRef;
  } catch (error: any) {
    console.error("Error writing to Firebase:", error);
    console.error("Error details:", {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
    });
    throw error;
  }
};

const VideoShowcase = () => {
  const videos = [
    {
      id: 1,
      title: "Morty",
      icon: MortyLogo,
      info: "This video was produced for the Morty app, a platform that helps users discover escape rooms and immersive experiences. It's a top-of-funnel video that has generated over 5 million organic views to date.",
      url: "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/video%2F0415.mov?alt=media&token=a469b248-2e71-42d4-979f-15bcbd35388f",
    },
    {
      id: 2,
      icon: LearnXYZLogo,
      title: "Learn XYZ",
      info: "This video was created for Learn XYZ. A consumer app that help people learn about the world. This particular video is a BOF video that has done over 5 million organic views",
      url: "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/video%2FVideo%204005.mp4%20%20%2B%20%22.%22%20%2B%20mp4?alt=media&token=ead99631-5380-44af-b17a-9bc3997b66b5",
    },
  ];

  const [requestedDemo, setRequestedDemo] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [scrollClickCount, setScrollClickCount] = useState(0);
  const [demoClickCount, setDemoClickCount] = useState(0);

  // Load states from Firebase on component mount
  useEffect(() => {
    const loadStates = async () => {
      try {
        const uniqueId = await getUniqueId();
        const docRef = doc(db, "treecardDemoRequests", uniqueId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setRequestedDemo(data.requestedDemo || false);
          setDemoClickCount(data.demoClickCount || 0);
        }
      } catch (error) {
        console.error("Error loading states from Firebase:", error);
      }
    };

    loadStates();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll percentage
      const scrollTop = window.scrollY;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrollTop / scrollHeight) * 100;

      // Show button only when scroll is less than 25%
      setShowScrollButton(scrollPercentage < 25);
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Initial check
    handleScroll();

    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = async () => {
    try {
      // Increment click count
      const newClickCount = scrollClickCount + 1;
      setScrollClickCount(newClickCount);

      // Scroll to bottom
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    } catch (error) {
      console.error("Error in scrollToBottom:", error);
    }
  };

  const handleDemoRequest = async () => {
    try {
      // Increment demo click count
      const newClickCount = demoClickCount + 1;
      setDemoClickCount(newClickCount);
      setRequestedDemo(!requestedDemo);

      // Update Firebase with new state
      await logToFirebase("treecardDemoRequests", {
        requestedDemo: !requestedDemo,
        demoClickCount: newClickCount,
      });

      // Update UI state
    } catch (error) {
      console.error("Error in handleDemoRequest:", error);
    }
  };

  return (
    <>
      {showScrollButton && (
        <div
          className="fixed bottom-4 right-4 bg-[#105156] text-white font-bold px-4 py-2 rounded-md flex items-center z-[999] cursor-pointer hover:bg-[#0a3d42] transition-colors"
          onClick={scrollToBottom}
        >
          <ArrowDown className="w-5 h-5 mr-1" />
          New Update
        </div>
      )}
      <div className="flex flex-col gap-2 w-full max-w-[1000px]">
        <h2 className="text-2xl font-bold mt-10 flex items-center gap-2 text-[#0A5153]">
          <Clapperboard className="w-5 h-5" />
          Example work
        </h2>
        <p className="text-black">
          Here are a couple of videos we've created for other consumer products.
          While both are heavily animated, they showcase our storytelling
          capabilities rather than the exact style we'll use for Treecard.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
          {videos.map((video) => (
            <div
              key={video.id}
              className="grid grid-cols-2 gap-4 border rounded-md shadow-md"
            >
              <div className="flex flex-col p-4 gap-4">
                <div className=" flex items-center  gap-2">
                  <video.icon className="w-8 h-8 rounded-[8px]" />
                  <h3 className="text-xl font-bold text-black">
                    {video.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-500">{video.info}</p>
              </div>
              <div className="  overflow-hidden rounded-r-md">
                <VideoPlayer
                  key={video.id}
                  videoUrl={video.url}
                  title={video.title}
                  className="rounded-l-none"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-[300px_1fr] mx-auto gap-4 border rounded-md shadow-md items-center p-4 mt-6">
          <div className="flex flex-col items-center gap-4">
            <p className="text-black font-bold text-center">
              We can make a custom sample video specifically for Treecard to
              give you a clearer idea of the tone, style, and storytelling
              approach you can expect from us. Just click the button below to
              let us know.
            </p>
            <Button onClick={handleDemoRequest} className="relative">
              {requestedDemo
                ? "We'll create your demo video soon! 🎬"
                : "Request free demo video"}
              {requestedDemo && (
                <motion.div
                  initial={{opacity: 0}}
                  animate={{opacity: 1}}
                  transition={{duration: 0.8}}
                  className="text-gray-500 absolute -bottom-[6px] translate-y-full z-[99] max-w-[400px]  h-fit whitespace-pre-wrap"
                >
                  Our team will finish working on your demo within 2-3 business
                  days
                </motion.div>
              )}
            </Button>
          </div>
          <div className="aspect-[9/16] w-fit h-[500px] bg-slate-200 animate-pulse rounded-md flex items-center justify-center">
            <span className="text-sm text-gray-500">
              {requestedDemo
                ? "Your demo video is coming soon..."
                : "Request free demo video"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoShowcase;
