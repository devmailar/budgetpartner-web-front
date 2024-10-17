import React, { useEffect, type ReactNode } from "react";
import { Link, RouterProvider, createBrowserRouter } from "react-router-dom";
import { getCookie } from "typescript-cookie";
import Image404 from "../../assets/404.webp";
import Budget from "../../routes/budget";
import BudgetExtraexpenses from "../../routes/budget-extraexpenses";
import BudgetExtraincomes from "../../routes/budget-extraincomes";
import BudgetNewExtraexpense from "../../routes/budget-new-extraexpense";
import BudgetNewExtraincome from "../../routes/budget-new-extraincome";
import ContactUs from "../../routes/contact-us";
import CookieNotice from "../../routes/cookie-notice";
import Login from "../../routes/login";
import PrivacyPolicy from "../../routes/privacy-policy";
import Profile from "../../routes/profile";
import Settings from "../../routes/settings";
import Signup from "../../routes/signup";
import TermsOfService from "../../routes/terms-of-service";
import Tour from "../../routes/tour";
import useAuthStore from "../../stores/auth";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <Budget />,
	},
	{
		path: "*",
		element: (
			<div className="h-screen animate__animated animate__slideInRight animate__faster">
				<div className="flex flex-col gap-y-4 items-center justify-center px-6 py-6">
					<img src={Image404} alt={Image404} width={130} height={130} loading="lazy" fetchPriority="high" />
					<h2 className="text-base text-[#66666F] font-semibold">404 - Page Not Found</h2>
					<p className="text-sm text-[#66666F] text-center font-normal">
						Oops! The page you're looking for doesn't exist.
					</p>
					<Link className="text-base text-white font-normal" to="/">
						Go back to Home
					</Link>
				</div>
			</div>
		),
	},
	{
		path: "/terms-of-service",
		element: <TermsOfService />,
	},
	{
		path: "/privacy-policy",
		element: <PrivacyPolicy />,
	},
	{
		path: "/contact-us",
		element: <ContactUs />,
	},
	{
		path: "/cookie-notice",
		element: <CookieNotice />,
	},
	{
		path: "/extraincomes",
		element: <BudgetExtraincomes />,
	},
	{
		path: "/extraexpenses",
		element: <BudgetExtraexpenses />,
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
		path: "/profile",
		element: <Profile />,
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

const AppNavigator = (): ReactNode => {
	const { setAuthStore } = useAuthStore();

	useEffect((): void => {
		try {
			const authenticate = (): void => {
				try {
					const auth: string = getCookie("auth") ?? "";
					setAuthStore(auth);
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
	}, []);

	return <RouterProvider router={router} />;
};

export default AppNavigator;
