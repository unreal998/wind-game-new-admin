/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // redirects: async () => {
  //   return [
  //     {
  //       source: "/",
  //       destination: "/overview",
  //       permanent: true,
  //     },
  //   ]
  // },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/api/images/**",
      },
      {
        protocol: "https",
        hostname: "wind-tap-cp.vercel.app",
        port: "",
        // pathname: "/storage/v1/object/public/**",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
}

export default nextConfig
