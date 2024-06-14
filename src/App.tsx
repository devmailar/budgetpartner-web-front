import type { Dispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { removeCookie } from "typescript-cookie";
import Budget from "./routes/Budget";
import BudgetGetStarted from "./routes/BudgetGetStarted";
import CreateAnAccount from "./routes/CreateAnAccount";
import Login from "./routes/Login";
import { setError } from "./stores/Error";
import type { IRootState } from "./types";

const router = createBrowserRouter([
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

	const errorMessage: string = useSelector((state: IRootState) => {
		return state.error.errorMessage;
	});

	return (
		<>
			<div className="absolute px-2 py-6 bg-[#000000] border-r-[1px] border-r-[#4B4B4B] h-screen">
				<div className="flex flex-col items-center justify-between h-full">
					<span className="text-4xl text-[#895FF5] font-black font-rubik">
						BP
					</span>

					<button
						type="button"
						className="flex items-center justify-center p-4"
						onClick={(): void => {
							removeCookie("Authorization");
							router.navigate("/");
						}}
					>
						<svg
							width="30"
							height="28"
							viewBox="0 0 30 28"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>Logout</title>
							<g clipPath="url(#clip0_105_20)">
								<path
									d="M22.25 6.22222L20.2055 8.41556L23.9465 12.4444H9.2V15.5556H23.9465L20.2055 19.5689L22.25 21.7778L29.5 14L22.25 6.22222ZM3.4 3.11111H15V0H3.4C1.805 0 0.5 1.4 0.5 3.11111V24.8889C0.5 26.6 1.805 28 3.4 28H15V24.8889H3.4V3.11111Z"
									fill="white"
								/>
							</g>
							<defs>
								<clipPath id="clip0_105_20">
									<rect
										width="29"
										height="28"
										fill="white"
										transform="translate(0.5)"
									/>
								</clipPath>
							</defs>
						</svg>
					</button>
				</div>
			</div>

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
