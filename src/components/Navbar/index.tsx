import type { Dispatch } from "@reduxjs/toolkit";
import type React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { NavigateFunction } from "react-router-dom";
import { getCookie } from "typescript-cookie";
import ArtLogo from "../../assets/logo.png";
import { setAuth } from "../../stores/Auth";
import { setError } from "../../stores/Error";
import { setModals } from "../../stores/Modals";
import type { IRootState } from "../../types";

interface IRouter {
	navigate: NavigateFunction;
}

interface INavbarProps {
	router: IRouter;
}

function Navbar({ router }: INavbarProps): React.ReactNode {
	const dispatch: Dispatch = useDispatch();

	const auth: string = useSelector((state: IRootState) => state.auth);

	const handleOpenSettingsModal = (): void => {
		try {
			dispatch(
				setModals({
					extraincome: false,
					extraexpense: false,
					language: false,
					settings: true,
				}),
			);
		} catch (error: unknown) {
			if (error instanceof Error) {
				dispatch(setError(error.message));
			}
		}
	};

	const handleRedirectToLogin = (): void => {
		try {
			router.navigate("/login");
		} catch (error: unknown) {
			if (error instanceof Error) {
				dispatch(setError(error.message));
			}
		}
	};

	const handleLogoutAndRedirectToLogin = (): void => {
		try {
			dispatch(setAuth(""));
			router.navigate("/login");
		} catch (error: unknown) {
			if (error instanceof Error) {
				dispatch(setError(error.message));
			}
		}
	};

	return (
		<div className="flex items-center justify-center md:bg-[#1A0D24] w-full px-[1.625rem] py-4 animate__animated animate__fadeInDown animate__faster">
			<div className="flex flex-wrap items-center justify-between w-full md:w-[800px]">
				<a href="/" className="flex gap-x-2 items-center">
					<img src={ArtLogo} alt={ArtLogo} width={28} height={28} />

					<h2 className="hidden md:block text-lg text-white font-normal lower font-rubik">budgetpartner.app</h2>
				</a>

				<div className="hidden md:flex gap-x-6 items-center">
					<button type="button" className="flex items-center justify-center" onClick={(): void => router.navigate("/")}>
						<span className="text-base text-white font-normal font-rubik">Home</span>
					</button>

					<button
						type="button"
						className="flex items-center justify-center"
						onClick={() => dispatch(setError("Coming soon! ✨"))}
					>
						<span className="text-base text-white font-normal font-rubik">Notes</span>
					</button>

					<button
						type="button"
						className="flex items-center justify-center"
						onClick={() => dispatch(setError("Coming soon! ✨"))}
					>
						<span className="text-base text-white font-normal font-rubik">Calculator</span>
					</button>

					<button
						type="button"
						className="flex items-center justify-center"
						onClick={() => dispatch(setError("Coming soon! ✨"))}
					>
						<span className="text-base text-white font-normal font-rubik">Support</span>
					</button>

					{getCookie("Authorization") && (
						<button
							type="button"
							className="flex items-center justify-center"
							onClick={(): void => handleOpenSettingsModal()}
						>
							<span className="text-base text-white font-normal font-rubik">Settings</span>
						</button>
					)}
				</div>

				<div className="flex gap-x-6 items-center">
					{auth ? (
						<button
							type="button"
							className="btn bg-darker flex items-center justify-center"
							onClick={(): void => handleLogoutAndRedirectToLogin()}
						>
							<span className="text-base text-white font-normal font-rubik">Logout</span>
						</button>
					) : (
						<button type="button" onClick={(): void => handleRedirectToLogin()}>
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<title>Login</title>
								<path
									d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
									stroke="white"
									stroke-width="1.5"
								/>
								<path
									d="M8.00781 15.9947L8.00787 8M17.9961 12.0041H11.6395M14 9L11.0147 12.0041L14.0095 14.9966"
									stroke="white"
									stroke-width="1.5"
								/>
							</svg>
						</button>
					)}
				</div>
			</div>
		</div>
	);
}

export default Navbar;
