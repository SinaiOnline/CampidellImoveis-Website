import React from "react";
import Footer from "./footer";
import Navbar from "./navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return ( 
    <div id="layout">
      <Navbar />
      <div id="content">
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default Layout