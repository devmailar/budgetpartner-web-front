import ky from "ky";

export const request = ky.create({ prefixUrl: "http://localhost:8080" });
