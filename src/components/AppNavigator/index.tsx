import type { Dispatch } from "@reduxjs/toolkit";
import React from "react";
import { useDispatch } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { getCookie } from "typescript-cookie";
import Budget from "../../routes/budget";
import BudgetNewExtraexpense from "../../routes/budget-new-extraexpense";
import BudgetNewExtraincome from "../../routes/budget-new-extraincome";
import Login from "../../routes/login";
import Settings from "../../routes/settings";
import Signup from "../../routes/signup";
import Tour from "../../routes/tour";
import { setAuthStore } from "../../stores/auth";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <Budget />,
	},
	{
		path: "/new-extraincome",
		element: <BudgetNewExtraincome />,
	},
	{
		path: "/new-extraexpense",
		element: <BudgetNewExtraexpense />,
	},
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/settings",
		element: <Settings />,
	},
	{
		path: "/signup",
		element: <Signup />,
	},
	{
		path: "/tour",
		element: <Tour />,
	},
]);

function AppNavigator(): React.ReactNode {
	const dispatch: Dispatch = useDispatch();

	React.useEffect((): void => {
		try {
			const authenticate = (): void => {
				try {
					const auth: string = getCookie("auth") ?? "";
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
