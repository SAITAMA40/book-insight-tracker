/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.join(__dirname),
      "@/components": path.join(__dirname, "components"),
      "@/app": path.join(__dirname, "app"),
    }
    return config
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
