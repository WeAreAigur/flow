module.exports = {
	reactStrictMode: true,
	transpilePackages: ['@aigur/flow', '@aigur/client'],
	images: {
		domains: ['rxbcnsluyhrlazakjohf.supabase.co'],
	},
	async redirects() {
		return [
			{
				source: '/',
				destination: 'https://app.aigur.dev',
				permanent: false,
			},
		];
	},
};
