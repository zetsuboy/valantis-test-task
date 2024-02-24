/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    basePath: process.env.NODE_ENV === 'production' ? "/valantis-test-task" : "",
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
