const baseurl: string = "https://unique-legible-seagull.ngrok-free.app";

const months: string[] = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const handleLoadLocales = async (locale: string) => {
	switch (locale) {
		case "en":
			return import("../locales/en.json");
		case "fi":
			return import("../locales/fi.json");
		default:
			return import("../locales/en.json");
	}
};

export const Utils = {
	baseurl,
	months,

	Methods: {
		handleLoadLocales,
	},
};
