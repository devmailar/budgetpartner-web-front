/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		fontFamily: {
			rubik: "Rubik",
			hanson: "Hanson",
		},
	},
	plugins: [require("kutty")],
};
