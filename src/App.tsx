import type { Dispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Modal from "./components/Modal";
import Sidebar from "./components/Sidebar";
import Budget from "./routes/Budget";
import BudgetGetStarted from "./routes/BudgetGetStarted";
import CreateAnAccount from "./routes/CreateAnAccount";
import Login from "./routes/Login";
import { setError } from "./stores/Error";
import type { IRootState } from "./types";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <Login />,
	},
	{
		path: "/create-an-account",
		element: <CreateAnAccount />,
	},
	{
		path: "/budget",
		element: <Budget />,
	},
	{
		path: "/budget/get-started",
		element: <BudgetGetStarted />,
	},
]);

function App() {
	const dispatch: Dispatch = useDispatch();

	const error: string = useSelector((state: IRootState) => state.error);

	return (
		<>
			<Sidebar />

			{error && (
				<Modal index={50}>
					<div className="px-4 py-4">
						<span className="text-sm text-[#FFFFFF] font-medium font-rubik">
							{error}
						</span>
					</div>

					<button
						type="button"
						className="btn btn-[#1A1A1A] border-t-[1px] border-t-[#242424]"
						onClick={() => dispatch(setError(""))}
					>
						<span className="text-sm text-[#895FF5] font-normal">Close</span>
					</button>
				</Modal>
			)}

			<RouterProvider router={router} />
		</>
	);
}

export default App;
