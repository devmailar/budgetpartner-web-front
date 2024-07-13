/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			backgroundImage: {
				"radial-gradient": "radial-gradient(66.5% 66.5% at 50% 33.5%, #1B1B1B 10%, #000000 80%)",
			},

			colors: {
				white: "#FFFFFF",
				purple: "#895FF5",
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
