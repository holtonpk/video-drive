import React from "react";
import "../marketing-style.css";

const BlogLayout = ({children}: {children: React.ReactNode}) => {
  return <body style={{backgroundColor: "#FFFFFF"}}>{children}</body>;
};

export default BlogLayout;
