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
        destination: '/download',
        permanent: true,
      },
      {
        source: '/contatti.html',
        destination: '/#contatti',
        permanent: true,
      },
      {
        source: '/chi-siamo.html',
        destination: '/#chi-siamo',
        permanent: true,
      },
      {
        source: '/web-ticket.html',
        destination: '/webticket',
        permanent: true,
      },
      {
        source: '/web-ticket-accettazione.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/software.html',
        destination: '/webapp',
        permanent: true,
      },

    ];
  },
};


export default nextConfig;
