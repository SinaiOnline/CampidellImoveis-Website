import siteConfig from "@/config";
import React from "react";

const GoogleMap = ({ address, style }: { address?: string, style?: React.CSSProperties }) => {
  address = address || siteConfig.address[0]

  if (!address) {
    return null
  }

  return (
    <iframe
      src={`https://maps.google.com/maps?q=${address}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
      width="100%"
      height="100%"
      style={{ border: 0, minHeight: "400px", ...style }}
      allowFullScreen
    />
  )   
}

export default GoogleMap