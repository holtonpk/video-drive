"use client";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import {Icons} from "@/components/icons";
import {buttonVariants} from "@/components/ui/button";
import {useSelectedLayoutSegment} from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useTheme} from "next-themes";
import {MoonIcon, SunIcon} from "@radix-ui/react-icons";
import {db} from "@/config/firebase";
import {Button} from "@/components/ui/button";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import {clients, Post, VideoDataWithPosts} from "@/config/data";
import {useAuth} from "@/context/user-auth";
import {onSnapshot} from "firebase/firestore";

const Navbar = () => {
  const segment = useSelectedLayoutSegment();
  const {currentUser, logOut} = useAuth()!;
  const {setTheme} = useTheme();

  return (
    <div className="justify-between top-0 gap-8 p-4 items-center z-[50] h-16 px-6 hidden sm:flex">
      <NavigationMenu>
        <NavigationMenuList className="gap-6">
          <NavigationMenuItem>
            <NavigationMenuTrigger
              className={`p-0 text-base bg-transparent font-bold px-2
             ${
               segment === "video-planning"
                 ? "text-primary"
                 : "text-muted-foreground hover:text-primary"
             }`}
            >
              Video Planning
            </NavigationMenuTrigger>

            <NavigationMenuContent>
              <ul className="grid gap-3 p-2 md:w-[400px] lg:w-[500px] ">
                {clients.map((client) => {
                  return (
                    <li key={client.id} className="row-span-3">
                      <Link
                        href={`/client-view/${client.value}`}
                        legacyBehavior
                        passHref
                      >
                        <NavigationMenuLink asChild>
                          <div
                            className={
                              "flex gap-2 items-center select-none space-y-1 rounded-md p-3 leading-none no-underline  outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            }
                          >
                            <client.icon className="h-6 w-6" />
                            <div className="text-base font-bold leading-none">
                              {client.label}
                            </div>
                          </div>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem className="relative">
            <NavigationMenuTrigger
              className={`p-0 text-base bg-transparent font-bold px-2
             ${
               segment === "client-library"
                 ? "text-primary"
                 : "text-muted-foreground hover:text-primary"
             }`}
            >
              Client Library
            </NavigationMenuTrigger>

            <NavigationMenuContent>
              <ul className="grid gap-3 p-2   md:w-[400px] lg:w-[500px]">
                {clients.map((client) => {
                  return (
                    <li key={client.id} className="row-span-3">
                      <Link
                        href={`/client-library/${client.value}`}
                        legacyBehavior
                        passHref
                      >
                        <NavigationMenuLink asChild>
                          <div
                            className={
                              "flex gap-2 items-center select-none space-y-1 rounded-md p-3 leading-none no-underline  outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            }
                          >
                            <client.icon className="h-6 w-6" />
                            <div className="text-base font-bold leading-none">
                              {client.label}
                            </div>
                          </div>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={`font-bold
        ${
          segment === "video-review"
            ? "text-primary "
            : "text-muted-foreground hover:text-primary"
        }
        `}
            >
              <VideoReview />
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/tasks" legacyBehavior passHref>
              <NavigationMenuLink
                className={`font-bold
        ${
          segment === "tasks"
            ? "text-primary "
            : "text-muted-foreground hover:text-primary"
        }
        `}
              >
                Tasks
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/invoices" legacyBehavior passHref>
              <NavigationMenuLink
                className={`font-bold
        ${
          segment === "invoices"
            ? "text-primary "
            : "text-muted-foreground hover:text-primary"
        }
        `}
              >
                Invoices
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/posting" legacyBehavior passHref>
              <NavigationMenuLink
                className={`font-bold
        ${
          segment === "posting"
            ? "text-primary"
            : "text-muted-foreground hover:text-primary"
        }
        `}
              >
                Post Schedule
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/blog-manage" legacyBehavior passHref>
              <NavigationMenuLink
                className={`font-bold
        ${
          segment === "blog-manage"
            ? "text-primary"
            : "text-muted-foreground hover:text-primary"
        }
        `}
              >
                Blog
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      {currentUser && (
        <div className="flex gap-2 items-center text-primary md:ml-auto">
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={currentUser?.photoURL}
              alt={currentUser.displayName || "User"}
            />
            <AvatarFallback>
              {currentUser?.firstName?.charAt(0).toUpperCase() +
                currentUser?.lastName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <DropdownMenu>
            <DropdownMenuTrigger className="text-md">
              {currentUser.displayName}
            </DropdownMenuTrigger>
            <DropdownMenuContent className=" w-[100px]">
              <DropdownMenuLabel>Your Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/settings">Notifications</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-destructive/30">
                <button onClick={logOut} className=" text-destructive">
                  Logout
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-9 px-0">
                <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};

export default Navbar;

const VideoReview = () => {
  const [displayVideos, setDisplayVideos] = useState<VideoDataWithPosts[]>();

  const {currentUser} = useAuth()!;
  const segment = useSelectedLayoutSegment();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "videos"), where("posted", "==", false)),
      async (querySnapshot) => {
        try {
          const filteredVideos = await Promise.all(
            querySnapshot.docs.map(async (docRef) => {
              const docData = docRef.data();
              console.log("docData", docData.videoNumber);

              const postData =
                docData.postIds &&
                Array.isArray(docData.postIds) &&
                (await Promise.all(
                  docData.postIds.map(async (postId: string) => {
                    const postDoc = doc(db, "posts", postId);
                    const postSnap = await getDoc(postDoc);
                    return postSnap.exists() ? postSnap.data() : null;
                  })
                ));

              return {
                ...docData,
                posts: postData?.filter(Boolean) as Post[],
              } as VideoDataWithPosts;
            })
          );
          setDisplayVideos(filteredVideos);
        } catch (error) {
          console.error("Error processing snapshot data:", error);
        }
      }
    );

    return () => unsubscribe(); // Cleanup listener
  }, []);

  [];

  const scriptsToReview = displayVideos?.filter((video: any) => {
    return (
      !video.scriptReviewed || !video.scriptReviewed.includes(currentUser?.uid)
    );
  });

  const videosToReview = displayVideos?.filter((video: any) => {
    return (
      (!video.videoReviewed ||
        !video.videoReviewed.includes(currentUser?.uid)) &&
      video.uploadedVideos &&
      video.uploadedVideos.length > 0
    );
  });

  const itemsToReview = [...(scriptsToReview || []), ...(videosToReview || [])];

  return (
    <NavigationMenuItem>
      <Link href="/video-review" legacyBehavior passHref>
        <NavigationMenuLink
          className={`font-bold
        ${
          segment === "video-review"
            ? "text-primary"
            : "text-muted-foreground hover:text-primary"
        }
        `}
        >
          Video Review {itemsToReview.length > 0 && `(${itemsToReview.length})`}
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  );
};
