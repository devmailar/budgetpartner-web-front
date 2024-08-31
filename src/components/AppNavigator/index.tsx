import type { Dispatch } from "@reduxjs/toolkit";
import React from "react";
import { useDispatch } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { getCookie } from "typescript-cookie";
import Login from "../../routes/login";
import { setAuthStore } from "../../stores/auth";
import Budget from "../../stores/budget";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <Budget />,
	},
	{
		path: "/login",
		element: <Login />,
	},
	// {
	// 	path: "/budget/new",
	// 	element: <BudgetNew />,
	// },
	// {
	// 	path: "/budget/get-started",
	// 	element: <BudgetGetStarted />,
	// },

	// {
	// 	path: "/create-an-account",
	// 	element: <CreateAnAccount />,
	// },
	// {
	// 	path: "/privacy-policy",
	// 	element: <PrivacyPolicy />,
	// },
]);

function AppNavigator(): React.ReactNode {
	const dispatch: Dispatch = useDispatch();

	React.useEffect((): void => {
		try {
			const authenticate = (): void => {
				try {
					const auth: string = getCookie("Authorization") ?? "";
					dispatch(setAuthStore(auth));
				} catch (error: unknown) {
					if (error instanceof Error) {
						alert(error.message);
					}
				}
			};

			authenticate();
		} catch (error: unknown) {
			if (error instanceof Error) {
				alert(error.message);
			}
		}
	}, [dispatch]);

	return <RouterProvider router={router} />;
}

export default AppNavigator;
