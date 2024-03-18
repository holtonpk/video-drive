import React from "react";
import Navbar from "./navbar";

const MainLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="flex flex-col ">
      <Navbar />
      {children}
    </div>
  );
};

export default MainLayout;
