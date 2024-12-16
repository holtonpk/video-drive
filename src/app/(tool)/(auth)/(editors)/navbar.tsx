"use client";
import React from "react";
import {doc, getDoc, onSnapshot, setDoc} from "firebase/firestore";
import {db} from "@/config/firebase";
import {VideoData, Post, clients, statuses} from "@/config/data";
import {MoonIcon, SunIcon} from "@radix-ui/react-icons";
import {Icons} from "@/components/icons";
import {ThemeProvider} from "@/components/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {useAuth} from "@/context/user-auth";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Logo} from "@/components/icons";
import AuthModal from "@/components/auth/auth-modal";
import RegisterForm from "@/components/auth/register";
import {useTheme} from "next-themes";
import Background from "@/components/background";

const Navbar = () => {
  const {currentUser, logOut} = useAuth()!;
  const {setTheme} = useTheme();
  return (
    <div className="flex w-full md:flex-row flex-col h-16   p-4 items-center px-8">
      <Link href={"/dashboard"} className="flex items-center">
        <Logo className="fill-primary h-9  md:h-9 mb-1" />
        <h1 className="text-3xl text-primary font-bold whitespace-nowrap  font1 ml-2">
          Whitespace Media
        </h1>
      </Link>

      {currentUser && (
        <div className=" gap-2 items-center text-primary md:ml-auto hidden md:flex">
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
