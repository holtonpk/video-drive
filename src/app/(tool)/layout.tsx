import React from "react";
import Navbar from "./(auth)/(admin)/navbar";
import {AuthProvider} from "@/context/user-auth";
import {Toaster} from "@/components/ui/toaster";

const MainLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="flex flex-col ">
      <AuthProvider>{children}</AuthProvider>
      <Toaster />
    </div>
  );
};

export default MainLayout;
