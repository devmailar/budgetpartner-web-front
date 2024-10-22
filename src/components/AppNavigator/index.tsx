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

			const installPopupAlreadyShowed: string | null = localStorage.getItem("installPopupAlreadyShowed");
			if (installPopupAlreadyShowed !== "true") {
				setPopupStore({ install: true });
			}

			setLoaderStore(true);
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
							<div className="flex gap-x-0.5 items-center">
								1. Click below on{" "}
								<svg
									className="mb-2"
									width="20"
									height="20"
									viewBox="0 0 20 20"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<title>Share</title>
									<path
										d="M13.3333 4.16683L12.1499 5.35016L10.8249 4.02516V13.3335H9.17492V4.02516L7.84992 5.35016L6.66659 4.16683L9.99992 0.833496L13.3333 4.16683ZM16.6666 8.3335V17.5002C16.6666 18.4168 15.9166 19.1668 14.9999 19.1668H4.99992C4.55789 19.1668 4.13397 18.9912 3.82141 18.6787C3.50885 18.3661 3.33325 17.9422 3.33325 17.5002V8.3335C3.33325 7.4085 4.07492 6.66683 4.99992 6.66683H7.49992V8.3335H4.99992V17.5002H14.9999V8.3335H12.4999V6.66683H14.9999C15.4419 6.66683 15.8659 6.84242 16.1784 7.15499C16.491 7.46755 16.6666 7.89147 16.6666 8.3335Z"
										fill="#037BFF"
									/>
								</svg>
							</div>
							2. Choose <b>Add to Home Screen</b>
						</p>

						<button
							type="button"
							className="flex gap-x-1 items-center justify-center w-full btn px-2 py-2 bg-transparent border border-[#66666F] rounded-lg"
							onClick={(): void => {
								setPopupStore({ install: false });
								localStorage.setItem("installPopupAlreadyShowed", "true");
							}}
						>
							<span className="text-sm text-[#66666F] font-bold">Close</span>
						</button>
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
