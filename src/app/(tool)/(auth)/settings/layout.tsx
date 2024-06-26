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

import {Logo} from "@/components/icons";
import AuthModal from "@/components/auth/auth-modal";
import RegisterForm from "@/components/auth/register";
import Link from "next/link";
import Navbar from "../(editors)/navbar";

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
    <div className="bg-background w-screen  min-h-screen px-4 md:px-0  flex flex-col items-center  ">
      <Navbar />

      {children}
    </div>
  );
};

export default Layout;
