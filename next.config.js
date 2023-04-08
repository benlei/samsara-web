/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    webpack: (config, { dev }) => {
        config.module.rules.push(
            {
                test: /\.spec.js$/,
                loader: 'ignore-loader'
            },
            {
                test: /playwright\.config\.ts$/,
                loader: 'ignore-loader'
            }
        );
        return config;
    }
}

module.exports = nextConfig