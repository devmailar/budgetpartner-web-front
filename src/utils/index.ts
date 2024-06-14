import ky from "ky";

export const request = ky.create({
	prefixUrl: "http://localhost:8080",
	retry: {
		limit: 0,
	},
});
