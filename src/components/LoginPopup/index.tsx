import type { Dispatch } from "@reduxjs/toolkit";
import type React from "react";
import { useDispatch } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import ArtLogin from "../../assets/login.png";
import { setError } from "../../stores/Error";
import { setForceLogin } from "../../stores/ForceLogin";
import Modal from "../Modal";

function LoginPopup(): React.ReactNode {
	const dispatch: Dispatch = useDispatch();
	const navigate: NavigateFunction = useNavigate();

	const handleLogin = (): void => {
		try {
			dispatch(setForceLogin(false));
			navigate("/login");
		} catch (error: unknown) {
			if (error instanceof Error) {
				dispatch(setError(error.message));
			}
		}
	};

	return (
		<Modal
			index={50}
			classes="gap-y-4 px-4 py-4 border border-dark shadow-sm shadow-dark animate__animated animate__fadeInDown animate__faster"
		>
			<img src={ArtLogin} alt={ArtLogin} width="200" />

			<button type="button" className="btn bg-purple2 rounded-base" onClick={(): void => handleLogin()}>
				<span className="text-sm text-white font-medium font-rubik">Login</span>
			</button>
		</Modal>
	);
}

export default LoginPopup;
