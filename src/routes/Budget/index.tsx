import type { Dispatch } from "@reduxjs/toolkit";
import type { KyResponse } from "ky";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { getCookie, removeCookie } from "typescript-cookie";
import { setError } from "../../stores/Error";
import { setUser } from "../../stores/User";
import type { IRootState, TUser } from "../../types";
import { request } from "../../utils";

function Budget() {
	const dispatch: Dispatch = useDispatch();
	const navigate: NavigateFunction = useNavigate();
	const user: TUser = useSelector((state: IRootState) => state.user);

	React.useEffect((): void => {
		const handleGetUser = async (authorization: string): Promise<void> => {
			try {
				const response: KyResponse = await request.get("users/get-one", {
					headers: {
						Authorization: `Bearer ${authorization}`,
					},
				});

				const user: TUser = await response.json();

				dispatch(setUser(user));

				if (user.is_new) navigate("get-started");
			} catch (error: unknown) {
				if (error instanceof Error) {
					dispatch(setError(error.name));
					removeCookie("Authorization");
					window.location.reload();
				}
			}
		};

		const authorization: string | undefined = getCookie("Authorization");

		if (!authorization) {
			navigate("/");
			return;
		}

		handleGetUser(authorization);
	}, [navigate, dispatch]);

	return (
		<div className="flex items-center justify-center bg-radial-gradient w-screen h-screen">
			<code className="text-4xl text-white">{JSON.stringify(user)}</code>
		</div>
	);
}

export default Budget;
