import type { NextConfig } from "next";

const config: NextConfig = {
  // Tambahkan blok images ini untuk memberi izin
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Kamu bisa menambahkan domain lain nanti di sini jika perlu
    ],
  },
};

export default config;