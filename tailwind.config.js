/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Montserrat', 'sans-serif'],
			},
		},
	},
	daisyui: {
		themes: [
			{
				mytheme: {
					primary: '#C9CCD5',
					secondary: '#E4D8DC',
					accent: '#45474B',
					neutral: '#C8ACD6',
					'base-100': '#ffffff',
				},
			},
		], // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
		base: true, // applies background color and foreground color for root element by default
		styled: true, // include daisyUI colors and design decisions for all components
		utils: true, // adds responsive and modifier utility classes
		prefix: '', // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
		logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
		themeRoot: ':root', // The element that receives theme color CSS variables
	},
	plugins: [
		require('daisyui'),
		require('tailwindcss'),
		require('autoprefixer'),
	],
};
