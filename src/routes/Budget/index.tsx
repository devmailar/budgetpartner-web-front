import React from "react";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { getCookie } from "typescript-cookie";
import { request } from "../../utils";

function Budget() {
	const navigate: NavigateFunction = useNavigate();

	const handleGetUser = React.useCallback(async (auth: string) => {
		try {
			const { data } = await request.get("users/get-one", {
				headers: {
					Authorization: `Bearer ${auth}`,
				},
			});

			console.log({
				data,
			});
		} catch (error: unknown) {
			if (error instanceof Error) {
				throw error;
			}
		}
	}, []);

	React.useEffect(() => {
		if (!getCookie("Authorization")) {
			return navigate("/");
		}

		const auth: string | undefined = getCookie("Authorization");

		if (auth) {
			console.info(auth);
			handleGetUser(auth);
		}
	}, [navigate, handleGetUser]);

	return (
		<div className="flex items-center justify-center bg-radial-gradient w-screen h-screen" />
	);
}

export default Budget;
