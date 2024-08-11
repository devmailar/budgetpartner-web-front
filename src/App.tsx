import type { Dispatch } from "@reduxjs/toolkit";
import React from "react";
import { IntlProvider } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { getCookie } from "typescript-cookie";
import ErrorPopup from "./components/ErrorPopup";
import Navbar from "./components/Navbar";
import Budget from "./routes/Budget";
import BudgetGetStarted from "./routes/BudgetGetStarted";
import BudgetNew from "./routes/BudgetNew";
import CreateAnAccount from "./routes/CreateAnAccount";
import Login from "./routes/Login";
import PrivacyPolicy from "./routes/PrivacyPolicy";
import { setAuth } from "./stores/Auth";
import type { IRootState } from "./types";
import { Utils } from "./utils";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <Budget />,
	},
	{
		path: "/budget/new",
		element: <BudgetNew />,
	},
	{
		path: "/budget/get-started",
		element: <BudgetGetStarted />,
	},
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/create-an-account",
		element: <CreateAnAccount />,
	},
	{
		path: "/privacy-policy",
		element: <PrivacyPolicy />,
	},
]);

function App(): React.ReactNode {
	const dispatch: Dispatch = useDispatch();

	const error: string = useSelector((state: IRootState) => state.error);
	const loader: boolean = useSelector((state: IRootState) => state.loader);

	const [locale] = React.useState(navigator?.language || "en");
	const [localeMessages, setLocaleMessages] = React.useState({});

	React.useEffect(() => {
		const handleLoadLocaleMessages = async (locale: string): Promise<void> => {
			const localeMessages = await Utils.Methods.handleLoadLocales(locale);
			setLocaleMessages(localeMessages.default);
		};

		handleLoadLocaleMessages(locale);

		const auth: string = getCookie("Authorization") ?? "";
		if (!auth) {
			return;
		}

		dispatch(setAuth(auth));
	}, [dispatch, locale]);

	return (
		<>
			{loader && (
				<div className="absolute flex items-center justify-center w-screen h-screen pb-40">
					<div className="loader" />
				</div>
			)}

			<IntlProvider locale={locale} messages={localeMessages}>
				<div className={`flex flex-col gap-y-10 md:gap-y-20 ${loader && "opacity-0"}`}>
					<Navbar router={router} />

					{error && <ErrorPopup />}

					<div className="flex justify-center w-screen h-screen px-6">
						<RouterProvider router={router} />
					</div>
				</div>
			</IntlProvider>
		</>
	);
}

export default App;
