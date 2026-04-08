import React from "react";
import "../marketing-style.css";

const LaunchLibraryLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div
      data-page-theme="dark"
      className="dark  min-h-[100dvh]"
      style={{
        backgroundColor: "#121212",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {children}
    </div>
  );
};

export default LaunchLibraryLayout;
