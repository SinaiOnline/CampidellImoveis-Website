import bundleAnalyzer from "@next/bundle-analyzer";

/** @type {import('next').NextConfig} */

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = withBundleAnalyzer({
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sistemasinaionline.com.br",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "snaion.com.br",
        port: "",
        pathname: "**",
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap.xml",
      },
    ];
  },
  modularizeImports: {
    "@mui/material": {
      transform: "@mui/material/{{member}}",
      skipDefaultConversion: true, // optional but safer for MUI
    },
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
    },
  },
  reactStrictMode: true,
});

export default nextConfig;
