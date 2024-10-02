/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'chace-pe-assets.s3.us-east-2.amazonaws.com',
      'chace-pe-assets-sandbox.s3.us-east-2.amazonaws.com',
      'precize-pc-assets-sandbox.s3.us-east-2.amazonaws.com',
      'precize-pc-assets.s3.us-east-2.amazonaws.com',
      'leadoff.s3.us-east-2.amazonaws.com',
    ],
  },
}

export default nextConfig
