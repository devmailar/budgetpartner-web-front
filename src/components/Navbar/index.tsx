import type { Dispatch } from "@reduxjs/toolkit";
import type React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { NavigateFunction } from "react-router-dom";
import { getCookie, removeCookie } from "typescript-cookie";
import ArtLogo from "../../assets/logo.png";
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
			removeCookie("Authorization");
			router.navigate("/login");
		} catch (error: unknown) {
			if (error instanceof Error) {
				dispatch(setError(error.message));
			}
		}
	};

	return (
		<div className="hidden sm:flex items-center justify-center bg-[#1A0D24] w-full px-3 py-3 animate__animated animate__fadeInDown animate__faster">
			<div className="flex flex-wrap items-center justify-between w-full md:w-[800px]">
				<a href="/" className="flex gap-x-2 items-center">
					<img src={ArtLogo} alt={ArtLogo} width={28} height={28} />

					<h2 className="text-lg text-white font-normal lower font-rubik">budgetpartner.app</h2>
				</a>

				<div className="flex gap-x-6 items-center">
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
						<button
							type="button"
							className="btn bg-dark flex items-center justify-center"
							onClick={(): void => handleRedirectToLogin()}
						>
							<span className="text-base text-white font-normal font-rubik">Login</span>
						</button>
					)}
				</div>
			</div>
		</div>
	);
}

export default Navbar;
