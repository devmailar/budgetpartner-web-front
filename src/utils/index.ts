import ky, { type KyInstance } from "ky";

export const request: KyInstance = ky.create({
	prefixUrl: "http://localhost:8080",
	retry: {
		limit: 0,
	},
});

export const Utils = {
	request,
};
