"use client";
import React from "react";

import {useRouter} from "next/navigation";
import {useAuth} from "@/context/user-auth";
import {ADMIN_USERS, EDITORS} from "@/config/data";
import Background from "@/components/background";
const MainLayout = ({children}: {children: React.ReactNode}) => {
  const {currentUser} = useAuth()!;

  const router = useRouter();

  if (!currentUser) return null;

  if (!ADMIN_USERS.includes(currentUser.uid)) {
    router.push("/edit");
    return (
      <div>
        <h1>Redirecting...</h1>
      </div>
    );
  }

  return (
    <div className="max-w-screen max-h-screen overflow-hidden">{children}</div>
  );
};

export default MainLayout;
