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
import useLoaderStore from "../../stores/loader";
import usePopupStore from "../../stores/popup";

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
	const { value: loader, setLoaderStore } = useLoaderStore();
	const { value: popup, setPopupStore } = usePopupStore();

	useEffect((): void => {
		try {
			const authenticate = (): void => {
				try {
					const auth: string = getCookie("auth") ?? "";
					setAuthStore(auth);
					setTimeout((): void => setLoaderStore(false), 1500);
				} catch (error: unknown) {
					if (error instanceof Error) {
						alert(error.message);
					}
				}
			};

			setLoaderStore(true);
			setPopupStore({ install: true });
			authenticate();
		} catch (error: unknown) {
			if (error instanceof Error) {
				alert(error.message);
			}
		}
	}, [setAuthStore, setLoaderStore, setPopupStore]);

	return (
		<>
			{popup.install && (
				<div className="absolute z-10 bg-black bg-opacity-40 backdrop-blur-sm w-full h-screen flex items-center justify-center">
					<div className="flex flex-col gap-y-4 bg-[#18181B] w-[260px] p-4 rounded-2xl">
						<div className="flex gap-x-2.5 items-center">
							<img src="/images/icons-144.png" alt="" width={30} />
							<h3 className="text-sm text-white font-bold">Install BudgetPartner</h3>
						</div>

						<p className="text-sm text-white font-normal">
							Install the app on your device to have it easily accessible at any time. Quite simply without an App
							Store.
							<br />
							<br />
							1. Click below on
							<br />
							<br />
							2. Choose Add to Home Screen
						</p>
					</div>
				</div>
			)}

			{loader && (
				<div className="absolute z-10 bg-black w-full h-screen flex items-center justify-center">
					<img
						className="animate-ping"
						src="/images/icons-144.png"
						alt="budgetpartner"
						width={60}
						height={60}
						loading="lazy"
					/>
				</div>
			)}

			<RouterProvider router={router} />
		</>
	);
};

export default AppNavigator;
