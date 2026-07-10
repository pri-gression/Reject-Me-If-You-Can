import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@tensorflow-models/pose-detection", "@mediapipe/pose"],
};

export default nextConfig;
