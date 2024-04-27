import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {},
	},
	darkMode: "class",
	plugins: [
		nextui({
			defaultTheme: "dark",
			defaultExtendTheme: "dark",
			themes: {
				dark: {
					colors: {
						primary: {
							50: "#180828",
							100: "#301050",
							200: "#481878",
							300: "#6020A0",
							400: "#7828C8",
							500: "#9353D3",
							600: "#AE7EDE",
							700: "#C9A9E9",
							800: "#E4D4F4",
							900: "#F2EAFA",
							DEFAULT: "#9353D3",
							foreground: "#ffffff",
						},
						background: "#000000",
						foreground: "#ffffff",
						focus: "#9353D3",
					},
				},
				light: {
					colors: {
						primary: {
							900: "#180828",
							800: "#301050",
							700: "#481878",
							600: "#6020A0",
							500: "#7828C8",
							400: "#9353D3",
							300: "#AE7EDE",
							200: "#C9A9E9",
							100: "#E4D4F4",
							50: "#F2EAFA",
							DEFAULT: "#7828C8",
							foreground: "#ffffff",
						},
						background: "#ffffff",
						foreground: "#000000",
						focus: "#7828C8",
					},
				},
			},
		}),
	],
};
export default config;
