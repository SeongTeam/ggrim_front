import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)',
				ggrimGrey1: '#F5F5F5',
				ggrimBeige1: '#F2EAD3',
				ggrimBeige2: '#DFD7BF',
				ggrimBrown1: '#3F2305',
			},
		},
	},
	plugins: [],
};
export default config;
