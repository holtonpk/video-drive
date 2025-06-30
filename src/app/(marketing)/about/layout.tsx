import React from "react";
import "../marketing-style.css";

const HomeLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <body className="dark" style={{backgroundColor: "#121212"}}>
      {children}
    </body>
  );
};

export default HomeLayout;
