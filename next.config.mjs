import { DevupUI } from '@devup-ui/next-plugin'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  webpack: (config) => {
    config.watchOptions = {
      ignored: ['**/df/**', '**/node_modules/**'],
    }
    return config
  },
  experimental: {
    optimizePackageImports: ['@devup-ui/react', 'lucide-react'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

export default DevupUI(nextConfig)
