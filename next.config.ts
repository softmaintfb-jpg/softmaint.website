import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.7.52"],
  images: {
    localPatterns: [
      {
        pathname: "/assets/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/download.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/contatti.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/chi-siamo.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/web-ticket.html',
        destination: '/',
        permanent: true,
      },
    ];
  },
};


export default nextConfig;
