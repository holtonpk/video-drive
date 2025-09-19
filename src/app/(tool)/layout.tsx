import React from "react";
import Navbar from "./(auth)/(admin)/navbar";
import {AuthProvider} from "@/context/user-auth";
// import {Toaster} from "@/components/ui/toaster";
import {ThemeProvider} from "@/components/theme-provider";
import "./tool-style.css";

const MainLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="flex flex-col  ">
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <AuthProvider>{children}</AuthProvider>
        {/* <Toaster /> */}
      </ThemeProvider>
    </div>
  );
};

export default MainLayout;
