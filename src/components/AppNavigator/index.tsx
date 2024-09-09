import type { Dispatch } from "@reduxjs/toolkit";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, RouterProvider, createBrowserRouter } from "react-router-dom";
import { getCookie } from "typescript-cookie";
import Budget from "../../routes/budget";
import BudgetNewExtraexpense from "../../routes/budget-new-extraexpense";
import BudgetNewExtraincome from "../../routes/budget-new-extraincome";
import Landing from "../../routes/landing";
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
		path: "*",
		element: (
			<div className="h-screen animate__animated animate__slideInRight animate__faster">
				<div className="flex flex-col gap-y-6 items-center justify-center px-6 py-6">
					<h2>404 - Page Not Found</h2>
					<p>Oops! The page you're looking for doesn't exist.</p>
					<Link to="/">Go back to Home</Link>
				</div>
			</div>
		),
	},
	{
		path: "/landing",
		element: <Landing />,
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
