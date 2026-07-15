/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ['localhost'],
    domains: ['e2visa.infinitysol.agency', 'localhost', '127.0.0.1', 'images.unsplash.com'],
  },
  experimental: {
    optimizeCss: true
  }
}

module.exports = nextConfig 