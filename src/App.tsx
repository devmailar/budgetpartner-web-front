import React from "react";
import { IntlProvider } from "react-intl";
import { useSelector } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPopup from "./components/ErrorPopup";
import Sidebar from "./components/Sidebar";
import Budget from "./routes/Budget";
import BudgetGetStarted from "./routes/BudgetGetStarted";
import BudgetNew from "./routes/BudgetNew";
import CreateAnAccount from "./routes/CreateAnAccount";
import Login from "./routes/Login";
import PrivacyPolicy from "./routes/PrivacyPolicy";
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
	}, [locale]);

	return (
		<>
			{loader && (
				<div className="absolute flex items-center justify-center w-screen h-screen pb-40">
					<div className="loader" />
				</div>
			)}

			<IntlProvider locale={locale} messages={localeMessages}>
				<div className={`${loader && "opacity-0"}`}>
					<div className="hidden sm:block">
						<Sidebar router={router} />
					</div>

					{error && <ErrorPopup />}

					<RouterProvider router={router} />
				</div>
			</IntlProvider>
		</>
	);
}

export default App;
