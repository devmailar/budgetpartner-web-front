import type { Dispatch } from "@reduxjs/toolkit";
import type React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { setAuthStore } from "../../stores/auth";
import type { IResponseError } from "../../types";
import { Utils } from "../../utils";

function Login(): React.ReactNode {
	const dispatch: Dispatch = useDispatch();
	const navigate: NavigateFunction = useNavigate();

	const [disableButton, setDisableButton] = useState<boolean>(false);

	const handleLogin = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		try {
			event.preventDefault();
			setDisableButton(true);

			const form: FormData = new FormData(event.currentTarget);
			const email: string = form.get("email") as string;
			const password: string = form.get("password") as string;

			const loginUserResponse: Response = await fetch(`${Utils.baseUrl}/users/login`, {
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

			dispatch(setAuthStore(auth));

			navigate("/");
		} catch (error: unknown) {
			if (error instanceof Error) {
				alert(error.message);

				setTimeout(() => setDisableButton(false), 2250);
			}
		}
	};

	return (
		<div className="bg-black h-screen">
			<nav className="flex items-center justify-between px-5 py-2.5 border-b border-b-[#474747]">
				<button
					type="button"
					onClick={(): void => {
						navigate("/");
					}}
				>
					<span className="text-lg text-[#007AFF]">Back</span>
				</button>

				<h2 className="text-lg text-white">BudgetPartner</h2>

				<button
					type="button"
					onClick={(): void => {
						navigate("/signup");
					}}
				>
					<span className="text-lg text-[#007AFF]">Sign up</span>
				</button>
			</nav>

			<form className="flex flex-col gap-7 items-center px-6 py-12" onSubmit={handleLogin}>
				<h1 className="text-2xl font-semibold text-white">Login to existing account</h1>

				<div className="flex flex-col gap-y-3">
					<div className="flex items-center gap-2 px-4 py-3 bg-[#18181B] border border-[#212121] rounded-lg">
						<svg width={24} height={24} fill="none" viewBox="0 0 24 24">
							<title>Email</title>
							<g clipPath="url(#clip0_906_59)">
								<path
									stroke="#66666F"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M3 7C3 6.46957 3.21071 5.96086 3.58579 5.58579C3.96086 5.21071 4.46957 5 5 5H19C19.5304 5 20.0391 5.21071 20.4142 5.58579C20.7893 5.96086 21 6.46957 21 7V17C21 17.5304 20.7893 18.0391 20.4142 18.4142C20.0391 18.7893 19.5304 19 19 19H5C4.46957 19 3.96086 18.7893 3.58579 18.4142C3.21071 18.0391 3 17.5304 3 17V7Z"
								/>
								<path
									stroke="#66666F"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M3 7L12 13L21 7"
								/>
							</g>
							<defs>
								<clipPath id="clip0_906_59">
									<rect width={24} height={24} fill={"white"} />
								</clipPath>
							</defs>
						</svg>

						<input
							className="bg-transparent text-base font-normal text-white placeholder:text-[#66666F] w-72 outline-none"
							type="email"
							name="email"
							id="email"
							placeholder="Email"
							autoComplete="email"
							required
						/>
					</div>

					<div className="flex items-center gap-2 px-4 py-3 bg-[#18181B] border border-[#212121] rounded-lg">
						<svg width={24} height={24} fill="none" viewBox="0 0 24 24">
							<title>Email</title>
							<g clipPath="url(#clip0_906_69)">
								<path stroke="#66666F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 10V14" />
								<path
									stroke="#66666F"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M10 13L14 11"
								/>
								<path
									stroke="#66666F"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M10 11L14 13"
								/>
								<path stroke="#66666F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M5 10V14" />
								<path stroke="#66666F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 13L7 11" />
								<path stroke="#66666F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 11L7 13" />
								<path stroke="#66666F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M19 10V14" />
								<path
									stroke="#66666F"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M17 13L21 11"
								/>
								<path
									stroke="#66666F"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M17 11L21 13"
								/>
							</g>
							<defs>
								<clipPath id="clip0_906_69">
									<rect width={24} height={24} fill={"white"} />
								</clipPath>
							</defs>
						</svg>

						<input
							className="bg-transparent text-base font-normal text-white placeholder:text-[#66666F] w-72 outline-none"
							type="password"
							name="password"
							id="password"
							placeholder="Password"
							autoComplete="current-password"
							required
						/>
					</div>
				</div>

				<div className="flex items-center justify-center w-full px-5 py-5 border-y border-y-[#313131]">
					<button
						type="submit"
						className={`btn bg-[#007AFF] w-full px-2 py-3 rounded-lg ${disableButton ? "opacity-40" : "opacity-100"}`}
						disabled={disableButton}
					>
						<span className="text-base font-medium text-white">Login</span>
					</button>
				</div>
			</form>
		</div>
	);
}

export default Login;
