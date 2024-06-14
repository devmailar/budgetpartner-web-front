/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			backgroundImage: {
				"radial-gradient":
					"radial-gradient(50% 50% at 50% 50%, #1B1B1B 15%, #000000 100%)",
			},
		},
		fontFamily: {
			rubik: ["Rubik"],
		},
	},
	plugins: [require("kutty")],
};
