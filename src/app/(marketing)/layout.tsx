import React from "react";
import "./marketing-style.css";

const HomeLayout = ({children}: {children: React.ReactNode}) => {
  return <body style={{backgroundColor: "#0f1115"}}>{children}</body>;
};

export default HomeLayout;
