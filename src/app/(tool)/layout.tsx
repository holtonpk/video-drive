import React from "react";
import Navbar from "./(auth)/(admin)/navbar";
import {AuthProvider} from "@/context/user-auth";
const MainLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="flex flex-col ">
      <AuthProvider>{children}</AuthProvider>
    </div>
  );
};

export default MainLayout;
