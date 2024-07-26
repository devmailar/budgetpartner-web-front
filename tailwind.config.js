/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				white: "#FFFFFF",
				purple: "#895FF5",
				purple2: "#6D28D9",
				orange: "#B85C3D",
				red: "#B83D3D",
				grey: "#4B4B4B",
				dark: "#252525",
				darker: "#1A1A1A",
				light: "#B7B7B7",
			},
		},

		fontFamily: {
			rubik: ["Rubik"],
		},
	},
	plugins: [require("kutty")],
};
