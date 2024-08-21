/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false,
  reactStrictMode: false,
  images: {
    loader: "custom",
    loaderFile: "./loader.mjs",
  },
};

export default nextConfig;
