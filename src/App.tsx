import type { Dispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { removeCookie } from "typescript-cookie";
import Modal from "./components/Modal";
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

					<div className="flex flex-col gap-y-2">
						<button
							type="button"
							className="flex items-center justify-center p-4"
						>
							<svg
								width="30"
								height="32"
								viewBox="0 0 30 32"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<title>Settings</title>
								<g clipPath="url(#clip0_105_17)">
									<path
										d="M26.305 17.4883C26.3683 17.0133 26.4 16.5225 26.4 16C26.4 15.4933 26.3683 14.9867 26.2892 14.5117L29.5033 12.01C29.6418 11.8958 29.7365 11.7372 29.7711 11.5611C29.8058 11.385 29.7783 11.2023 29.6933 11.0442L26.6533 5.78749C26.5638 5.62847 26.4209 5.50625 26.25 5.4425C26.079 5.37874 25.8909 5.37756 25.7192 5.43916L21.935 6.95916C21.1433 6.35749 20.3042 5.85083 19.37 5.47083L18.8 1.44916C18.772 1.26791 18.6799 1.10274 18.5404 0.983621C18.4009 0.864506 18.2234 0.799352 18.04 0.799992H11.96C11.58 0.799992 11.2792 1.06916 11.2158 1.44916L10.6458 5.47083C9.71167 5.85083 8.85667 6.37333 8.08084 6.95916L4.29667 5.43916C3.94834 5.31249 3.5525 5.43916 3.3625 5.78749L0.338338 11.0442C0.148338 11.3767 0.211671 11.7883 0.528337 12.01L3.7425 14.5117C3.66334 14.9867 3.6 15.5092 3.6 16C3.6 16.4908 3.63167 17.0133 3.71084 17.4883L0.496671 19.99C0.358167 20.1042 0.263531 20.2628 0.228886 20.4389C0.19424 20.615 0.22173 20.7977 0.306671 20.9558L3.34667 26.2125C3.53667 26.5608 3.9325 26.6717 4.28084 26.5608L8.065 25.0408C8.85667 25.6425 9.69584 26.1492 10.63 26.5292L11.2 30.5508C11.2792 30.9308 11.58 31.2 11.96 31.2H18.04C18.42 31.2 18.7367 30.9308 18.7842 30.5508L19.3542 26.5292C20.2883 26.1492 21.1433 25.6425 21.9192 25.0408L25.7033 26.5608C26.0517 26.6875 26.4475 26.5608 26.6375 26.2125L29.6775 20.9558C29.8675 20.6075 29.7883 20.2117 29.4875 19.99L26.305 17.4883ZM15 21.7C11.865 21.7 9.3 19.135 9.3 16C9.3 12.865 11.865 10.3 15 10.3C18.135 10.3 20.7 12.865 20.7 16C20.7 19.135 18.135 21.7 15 21.7Z"
										fill="white"
									/>
								</g>
								<defs>
									<clipPath id="clip0_105_17">
										<rect
											width="29.5714"
											height="30.4"
											fill="white"
											transform="translate(0.214294 0.799988)"
										/>
									</clipPath>
								</defs>
							</svg>
						</button>
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
			</div>

			{errorMessage && (
				<Modal index={50}>
					<div className="px-4 py-4">
						<span className="text-sm text-[#FFFFFF] font-medium font-rubik">
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
				</Modal>
			)}

			<RouterProvider router={router} />
		</>
	);
}

export default App;
