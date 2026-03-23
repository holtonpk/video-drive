import React from "react";
import "../marketing-style.css";

const LaunchLibraryLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="dark" style={{backgroundColor: "#121212"}}>
      {children}
    </div>
  );
};

export default LaunchLibraryLayout;
