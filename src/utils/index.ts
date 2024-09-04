const baseUrl: string = "https://unique-legible-seagull.ngrok-free.app";
const monthsList: string[] = [
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

const formatCurrencyFunction = (currency: string) => {
	try {
		switch (currency) {
			case "EUR":
				return "€";
			case "USD":
				return "$";
			case "INR":
				return "₹";
			case "BDT":
				return "৳";
			default:
				return "€";
		}
	} catch (error: unknown) {
		if (error instanceof Error) {
			alert(error.message);
		}
	}
};

export const Utils = { baseUrl, monthsList, formatCurrencyFunction };
