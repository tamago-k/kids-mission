import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  matcher: ["/parent/:path*", "/child/:path*"],
};

export default nextConfig;
