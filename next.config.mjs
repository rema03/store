/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    domains: [
      'res.cloudinary.com',
      'cdn.example.com',
      'images.unsplash.com',
    ],
  },
}

export default nextConfig
