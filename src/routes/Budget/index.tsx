import type { Dispatch } from "@reduxjs/toolkit";
import React from "react";
import { useDispatch } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { getCookie } from "typescript-cookie";
import { setUser } from "../../stores/User";
import type { TUser } from "../../types";
import { request } from "../../utils";

function Budget() {
	const dispatch: Dispatch = useDispatch();
	const navigate: NavigateFunction = useNavigate();

	const handleGetUser = React.useCallback(
		async (authorization: string): Promise<void> => {
			try {
				const {
					data: user,
				}: {
					data: TUser;
				} = await request.get("users/get-one", {
					headers: {
						Authorization: `Bearer ${authorization}`,
					},
				});

				dispatch(setUser(user));

				if (user.is_new) {
					navigate("/budget/get-started");
					return;
				}
			} catch (error: unknown) {
				if (error instanceof Error) {
					throw error;
				}
			}
		},
		[navigate, dispatch],
	);

	React.useEffect((): void => {
		const authorization: string | undefined = getCookie("Authorization");

		if (!authorization) {
			navigate("/");
			return;
		}

		handleGetUser(authorization);
	}, [navigate, handleGetUser]);

	return (
		<div className="flex items-center justify-center bg-radial-gradient w-screen h-screen" />
	);
}

export default Budget;
