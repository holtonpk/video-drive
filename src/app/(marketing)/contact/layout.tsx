import React from "react";
import "../marketing-style.css";
import {Toaster} from "@/components/ui/toaster";

const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <body style={{backgroundColor: "#121212"}}>
      {children}
      <Toaster />
    </body>
  );
};

export default Layout;
