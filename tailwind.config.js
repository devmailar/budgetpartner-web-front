/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			backgroundImage: {
				"radial-gradient": "radial-gradient(66.5% 66.5% at 50% 33.5%, #1B1B1B 10%, #000000 80%)",
			},
		},
		fontFamily: {
			rubik: ["Rubik"],
		},
	},
	plugins: [require("kutty")],
};
