import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Export a fully static site (no server needed) so it can be hosted on
  // GitHub Pages. The site is 100% client-side, so this is lossless.
  output: "export",
  // GitHub Pages can't run Next.js image optimization — serve images as-is.
  images: { unoptimized: true },
  // Pages serves from a subpath and is picky about trailing slashes.
  trailingSlash: true,
};

export default nextConfig;
