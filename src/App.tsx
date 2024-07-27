import type React from "react";
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

	return (
		<>
			{loader && (
				<div className="absolute flex items-center justify-center w-screen h-screen pb-40">
					<div className="loader" />
				</div>
			)}

			<div className={`${loader && "opacity-0"}`}>
				<div className="hidden sm:block">
					<Sidebar router={router} />
				</div>

				{error && <ErrorPopup />}

				<RouterProvider router={router} />
			</div>
		</>
	);
}

export default App;
