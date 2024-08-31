/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				White: "#FFFFFF",

				Purple: "#895FF5",
				PurpleDark: "#160C1F",
				PurpleLight: "#57456F",
				PurpleBright: "#6D28D9",

				Orange: "#B85C3D",

				Grey: "#313131",
				GreyLight: "#A0A0A0",
				GreyTransparent: "rgba(26, 26, 26, 0.7)",
				GreyTransparentStroke: "rgba(49, 49, 49, 0.5)",
			},
		},
	},
	plugins: [require("kutty")],
};
