/** @type {import('next').NextConfig} */
const nextConfig = {
	async redirects() {
		return [
			{
				source: "/dashboard",
				destination: "/dashboard/chatbots",
				permanent: true,
			},
		];
	},
	images: {
		dangerouslyAllowSVG: true,
		remotePatterns: [
			{
				hostname: process.env.IMAGES_HOST,
			},
		],
	},
};

module.exports = nextConfig;
