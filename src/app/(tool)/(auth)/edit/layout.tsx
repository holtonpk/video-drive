"use client";
import React from "react";
import {doc, getDoc, onSnapshot, setDoc} from "firebase/firestore";
import {db} from "@/config/firebase";
import {VideoData, Post, clients, statuses} from "@/config/data";
import {Icons} from "@/components/icons";
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

const Layout = ({children}: {children: React.ReactNode}) => {
  const {currentUser, logOut} = useAuth()!;

  if (!currentUser)
    return (
      <div className=" items-center justify-center w-screen h-screen flex">
        <div className="w-fit ">
          <RegisterForm />
        </div>
      </div>
    );

  return (
    <div className="bg-background w-screen dark min-h-screen px-4 md:px-0  flex flex-col items-center  ">
      <div className="flex w-full md:flex-row flex-col  p-4 items-center px-8">
        <Link href={"/edit"} className="flex items-center">
          <Logo className="fill-foreground h-6  md:h-6 mb-1" />
          <h1 className="text-3xl text-foreground font-bold whitespace-nowrap  font1 ml-2">
            Whitespace Media
          </h1>
        </Link>
        {currentUser && (
          <div className="flex gap-2 items-center text-foreground md:ml-auto">
            <Avatar className="h-9 w-9">
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
              <DropdownMenuTrigger className="text-xl">
                {currentUser.displayName}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="dark w-[100px]">
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
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

export default Layout;
