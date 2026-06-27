/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Го игнорираме TS за побрз развој
    ignoreBuildErrors: true,
  },
  images: {
    // Ова е клучно за сликите од Unsplash
    unoptimized: true,
  },
  // Ова го решава блокирањето на мрежниот пристап (Allowed Origins)
  allowedDevOrigins: ['192.168.56.1'],
  experimental: {
    // Дополнителни опции ако користиш Turbopack
  },
};

export default nextConfig;