import React, { useState, type FormEvent, type ReactNode } from "react";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import ImageTrustpilot from "../../assets/trustpilot.webp";
import useAuthStore, { type IAuthState } from "../../stores/auth";
import type { IResponseError } from "../../types";
import { Utils } from "../../utils";

const Login = (): ReactNode => {
	const navigate: NavigateFunction = useNavigate();

	const setAuthStore: IAuthState["setAuthStore"] = useAuthStore.getState().setAuthStore;

	const [disableSubmit, setDisableSubmit] = useState<boolean>(false);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
		try {
			event.preventDefault();

			setDisableSubmit(true);

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

				throw new Error(loginUserResponseError.errorMessage);
			}

			const authHeader: string = loginUserResponse.headers.get("Authorization") ?? "";
			const auth: string = authHeader.split(" ")[1];

			setAuthStore(auth);

			navigate("/");
		} catch (error: unknown) {
			if (error instanceof Error) {
				setTimeout(() => setDisableSubmit(false), 2250);

				alert(error.message);
				throw new Error(error.stack);
			}
		}
	};

	return (
		<div className="flex flex-col gap-y-6 animate__animated animate__slideInRight animate__faster">
			<nav className="flex items-center justify-between px-8 py-3 border-b-[0.33px] border-b-[#454545]">
				<button type="button" onClick={(): void => navigate("/")}>
					<span className="text-xl text-[#66666F] font-bold">Back</span>
				</button>

				<button type="button" onClick={(): void => navigate("/signup")}>
					<span className="text-xl text-white font-bold">Sign up</span>
				</button>
			</nav>

			<form className="flex flex-col gap-y-6 items-center px-8" onSubmit={handleSubmit}>
				<h2 className="text-2xl text-white font-bold">Login to existing account</h2>

				<div className="flex flex-col gap-y-2 w-full">
					<div className="flex gap-x-2 items-center px-4 py-3 bg-[#18181B] border border-[#212121] rounded-lg">
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
							className="bg-transparent text-base text-white placeholder:text-[#66666F] font-normal outline-none"
							type="email"
							name="email"
							id="email"
							placeholder="Email"
							autoComplete="email"
							required
						/>
					</div>

					<div className="flex gap-x-2 items-center px-4 py-3 bg-[#18181B] border border-[#212121] rounded-lg">
						<svg width={24} height={24} fill="none" viewBox="0 0 24 24">
							<title>Password</title>
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
							className="bg-transparent text-base text-white placeholder:text-[#66666F] font-normal outline-none"
							type="password"
							name="password"
							id="password"
							placeholder="Password"
							autoComplete="current-password"
							required
						/>
					</div>
				</div>

				<button
					type="submit"
					className={`btn bg-[#009951] w-full px-2 py-3 ${disableSubmit ? "opacity-40" : "opacity-100"} rounded-lg`}
					disabled={disableSubmit}
				>
					<span className="text-base text-white font-bold">Login</span>
				</button>

				<div className="flex flex-col gap-y-3">
					<p className="w-full text-sm text-[#66666F] font-normal">
						Your financial information is safe with us. BudgetPartner securely stores your data, allowing you to revisit
						your progress over time. It’s like having a personal financial assistant at your fingertips.
					</p>

					<div className="flex flex-wrap gap-x-2">
						<a className="text-sm text-[#323232] font-normal underline" href="/terms-of-service">
							Terms of Service
						</a>

						<a className="text-sm text-[#323232] font-normal underline" href="/privacy-policy">
							Privacy Policy
						</a>

						<a className="text-sm text-[#323232] font-normal underline" href="/contact-us">
							Contact Us
						</a>

						<a className="text-sm text-[#323232] font-normal underline" href="/cookie-notice">
							Cookie Notice
						</a>
					</div>
				</div>

				<img src={ImageTrustpilot} alt="trustpilot" width={60} />
			</form>
		</div>
	);
};

export default Login;
