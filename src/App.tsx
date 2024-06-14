import type { Dispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Budget from "./routes/Budget";
import BudgetGetStarted from "./routes/BudgetGetStarted";
import CreateAnAccount from "./routes/CreateAnAccount";
import Login from "./routes/Login";
import { setError } from "./stores/Error";
import type { IRootState } from "./types";

const router = createBrowserRouter([
	{
		path: "/",
		index: true,
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

	const errorMessage: string = useSelector((state: IRootState) => {
		return state.error.errorMessage;
	});

	return (
		<>
			{errorMessage && (
				<div className="absolute z-20 flex items-center justify-center w-screen h-screen bg-black bg-opacity-40">
					<div className="flex flex-col bg-[#1A1A1A] rounded-2xl max-w-96">
						<div className="px-4 py-4">
							<span className="text-sm text-white font-medium font-rubik">
								{errorMessage}
							</span>
						</div>

						<button
							type="button"
							className="btn btn-[#1A1A1A] border-t-[1px] border-t-[#242424]"
							onClick={() => dispatch(setError(""))}
						>
							<span className="text-sm text-[#895FF5] font-normal">Close</span>
						</button>
					</div>
				</div>
			)}

			<RouterProvider router={router} />
		</>
	);
}

export default App;
