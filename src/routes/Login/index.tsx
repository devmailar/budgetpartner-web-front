import type { Dispatch } from "@reduxjs/toolkit";
import React from "react";
import { useDispatch } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { getCookie, setCookie } from "typescript-cookie";
import { setError } from "../../stores/Error";
import type { IResponseError } from "../../types";

function Login(): React.ReactNode {
	const dispatch: Dispatch = useDispatch();
	const navigate: NavigateFunction = useNavigate();

	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	const handleLogin = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		try {
			event.preventDefault();
			setIsLoading(true);

			const form: FormData = new FormData(event.currentTarget);
			const email: string = form.get("email") as string;
			const password: string = form.get("password") as string;

			const loginUserResponse: Response = await fetch("https://unique-legible-seagull.ngrok-free.app/users/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: email, password: password }),
			});

			if (!loginUserResponse.ok) {
				const loginUserResponseError: IResponseError = await loginUserResponse.json();

				throw new Error(loginUserResponseError.message);
			}

			const authHeader: string = loginUserResponse.headers.get("Authorization") ?? "";
			const auth: string = authHeader.split(" ")[1];

			setCookie("Authorization", auth, { expires: 1, sameSite: "strict", secure: true });

			navigate("/budget");
		} catch (error: unknown) {
			if (error instanceof Error) {
				dispatch(setError(error.message));
				setTimeout(() => setIsLoading(false), 1500);
			}
		}
	};

	React.useEffect((): void => {
		const auth: string = getCookie("Authorization") ?? "";
		if (!auth) return;

		navigate("/budget");
	}, [navigate]);

	return (
		<div className="flex items-center justify-center bg-radial-gradient w-screen h-screen">
			<form className="flex flex-col w-[26rem] zoom" onSubmit={handleLogin}>
				<div className="flex flex-col gap-y-6">
					<div className="flex flex-col gap-y-1 items-center">
						<h1 className="text-2xl text-white font-medium font-rubik">Login to existing account</h1>
						<p className="text-base text-white font-normal font-rubik">Enter your login credentials</p>
					</div>

					<div className="flex flex-col gap-y-3 ">
						<input
							className="bg-transparent border-purple border-2 px-2 py-2 text-lg text-white font-normal font-rubik rounded-lg"
							type="email"
							id="email"
							name="email"
							placeholder="Email"
							autoComplete="email"
							required
						/>

						<input
							className="bg-transparent border-purple border-2 px-2 py-2 text-lg text-white font-normal font-rubik rounded-lg"
							type="password"
							id="password"
							name="password"
							placeholder="Password"
							autoComplete="current-password"
							required
						/>
					</div>
				</div>

				<div className="flex flex-col">
					<input
						className={`mt-4 btn ${isLoading ? "bg-grey" : "bg-purple"} text-sm text-white font-medium py-2.5 mb-5 rounded-lg`}
						type="submit"
						value="Login with email"
						disabled={isLoading}
					/>

					<div className="flex gap-x-2 items-center justify-center">
						<div className="border-[0.1px] border-light w-1/3" />
						<p className="text-base text-white font-normal">or continue with</p>
						<div className="border-[0.1px] border-light w-1/3" />
					</div>

					<button
						type="button"
						className="btn bg-darker py-2.5 mt-5 rounded-lg"
						onClick={() => navigate("/create-an-account")}
						disabled={isLoading}
					>
						<span className="text-sm text-white font-medium font-rubik">Create an account</span>
					</button>
				</div>
			</form>
		</div>
	);
}

export default Login;
