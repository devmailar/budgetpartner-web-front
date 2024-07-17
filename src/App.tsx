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
]);

function App(): React.ReactNode {
	const error: string = useSelector((state: IRootState) => state.error);

	return (
		<>
			<div className="hidden sm:block">
				<Sidebar />
			</div>

			{error && <ErrorPopup />}

			<RouterProvider router={router} />
		</>
	);
}

export default App;
