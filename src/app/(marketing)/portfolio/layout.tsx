import React from "react";
import "../marketing-style.css";

const PortfolioLayout = ({children}: {children: React.ReactNode}) => {
  return <div style={{backgroundColor: "#fff"}}>{children}</div>;
};

export default PortfolioLayout;
