import ky, { type KyInstance } from "ky";

export const request: KyInstance = ky.create({
	prefixUrl: "http://localhost:8080",
	retry: {
		limit: 0,
	},
});

export const months: string[] = [
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

export const Utils = {
	request,
	months,
};
