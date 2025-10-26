import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    SUPABASE_KEY: process.env.SUPABASE_KEY,
  },
};

export default nextConfig;
