import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 親フォルダ（C:\workspace）にも package-lock.json があるため、プロジェクトのルートを明示する
  turbopack: { root: import.meta.dirname },
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;
