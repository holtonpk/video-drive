import React from "react";
import "../marketing-style.css";

const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <body className="dark" style={{backgroundColor: "#121212"}}>
      {children}
    </body>
  );
};

export default Layout;
