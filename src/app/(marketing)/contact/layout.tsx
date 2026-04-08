import React from "react";
import "../marketing-style.css";
import {Toaster} from "@/components/ui/toaster";

const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div
      data-page-theme="dark"
      className="dark"
      style={{backgroundColor: "#121212"}}
    >
      {children}
      <Toaster />
    </div>
  );
};

export default Layout;
