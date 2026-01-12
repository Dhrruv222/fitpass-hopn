/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'via.placeholder.com'],
    unoptimized: true
  },
  output: 'standalone'
}

module.exports = nextConfig
