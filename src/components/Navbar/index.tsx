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
		<div className="flex items-center justify-center md:bg-[#1A0D24] w-full px-6 py-6 md:py-3.5 animate__animated animate__fadeInDown animate__faster">
			<div className="flex flex-wrap items-center justify-between w-full md:w-[800px]">
				<a href="/" className="flex gap-x-2 items-center">
					<img src={ArtLogo} alt={ArtLogo} width={28} height={28} />

					<h2 className="hidden md:block text-lg text-white font-normal font-rubik">budgetpartner.app</h2>
				</a>

				<div className="hidden md:flex gap-x-6 items-center">
					<button type="button" className="flex items-center justify-center" onClick={(): void => router.navigate("/")}>
						<span className="text-base text-white font-medium font-rubik">Home</span>
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
							className="flex gap-x-1.5 items-center btn bg-[#313131] bg-opacity-50 px-3 py-2 rounded-full"
							onClick={(): void => handleLogoutAndRedirectToLogin()}
						>
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<title>Logout</title>
								<path
									d="M18.3334 9.99996C18.3334 5.39758 14.6024 1.66663 10.0001 1.66663C5.39771 1.66663 1.66675 5.39758 1.66675 9.99996C1.66675 14.6023 5.39771 18.3333 10.0001 18.3333C14.6024 18.3333 18.3334 14.6023 18.3334 9.99996Z"
									stroke="white"
								/>
								<path
									d="M9.16667 12.0752L11.25 9.99183L9.16667 7.90852M6.25 9.99183H10.7427M13.75 12.5V7.5"
									stroke="white"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>

							<span className="text-sm text-white font-normal font-rubik">Logout</span>
						</button>
					) : (
						<button
							type="button"
							className="flex gap-x-1.5 items-center btn bg-[#895FF5] bg-opacity-50 px-3 py-2 rounded-full"
							onClick={(): void => handleRedirectToLogin()}
						>
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<title>Login</title>
								<path
									d="M10.0001 18.3333C14.6024 18.3333 18.3334 14.6023 18.3334 9.99996C18.3334 5.39758 14.6024 1.66663 10.0001 1.66663C5.39771 1.66663 1.66675 5.39758 1.66675 9.99996C1.66675 14.6023 5.39771 18.3333 10.0001 18.3333Z"
									stroke="white"
								/>
								<path
									d="M6.6731 13.3289L6.67315 6.66663M14.9967 10.0034H9.6995M11.6666 7.49996L9.17884 10.0034L11.6745 12.4971"
									stroke="white"
								/>
							</svg>

							<span className="text-sm text-white font-normal font-rubik">Login</span>
						</button>
					)}
				</div>
			</div>
		</div>
	);
}

export default Navbar;
