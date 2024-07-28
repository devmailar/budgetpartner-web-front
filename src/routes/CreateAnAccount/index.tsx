import type { Dispatch } from "@reduxjs/toolkit";
import React from "react";
import { useDispatch } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { setError } from "../../stores/Error";
import type { IResponseError } from "../../types";
import { Utils } from "../../utils";

function CreateAnAccount(): React.ReactNode {
	const dispatch: Dispatch = useDispatch();
	const navigate: NavigateFunction = useNavigate();

	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	const handleCreate = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		try {
			event.preventDefault();
			setIsLoading(true);

			const form: FormData = new FormData(event.currentTarget);
			const email: string = form.get("email") as string;
			const password: string = form.get("password") as string;

			const createBudgetResponse: Response = await fetch(`${Utils.baseurl}/users/create`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: email, password: password, country: "" }),
			});

			if (!createBudgetResponse.ok) {
				const createBudgetResponseError: IResponseError = await createBudgetResponse.json();

				throw new Error(createBudgetResponseError.message);
			}

			navigate("/login");
		} catch (error: unknown) {
			if (error instanceof Error) {
				dispatch(setError(error.message));
				setTimeout(() => setIsLoading(false), 2500);
			}
		}
	};

	return (
		<div className="flex items-center justify-center w-screen h-screen">
			<form className="flex flex-col gap-y-4 w-[26rem] zoom" onSubmit={handleCreate}>
				<div className="flex items-center justify-end">
					<button type="button" onClick={(): void => navigate("/login")}>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
							<title>Close</title>
							<g clipPath="url(#clip0_283_267)">
								<path d="M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
								<path d="M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
							</g>
							<defs>
								<clipPath id="clip0_283_267">
									<rect width="24" height="24" fill="white" />
								</clipPath>
							</defs>
						</svg>
					</button>
				</div>

				<div className="flex flex-col gap-y-6">
					<div className="flex flex-col gap-y-1 items-center">
						<h1 className="text-2xl text-white font-medium font-rubik">Create an account</h1>
						<p className="text-base text-white font-normal font-rubik">Enter your email to sign up</p>
					</div>

					<div className="flex flex-col gap-y-3">
						<input
							className="bg-transparent border-purple2 border px-2 py-2 text-lg text-white placeholder:text-white font-normal font-rubik rounded-lg"
							type="email"
							id="email"
							name="email"
							placeholder="Email"
							autoComplete="email"
							required
						/>

						<input
							className="bg-transparent border-purple2 border px-2 py-2 text-lg text-white placeholder:text-white font-normal font-rubik rounded-lg"
							type="password"
							id="password"
							name="password"
							placeholder="Password"
							autoComplete="password"
							required
						/>
					</div>
				</div>

				<div className="flex flex-col gap-y-4">
					<input
						className="btn bg-purple2 text-sm text-white font-medium py-2.5 rounded-lg"
						type="submit"
						value="Sign up with email"
						disabled={isLoading}
					/>

					<div className="text-center px-4">
						<p className="text-base text-white font-light font-rubik">
							By clicking continue, you agree to our{" "}
							<a href="terms-of-service" className="text-purple">
								Terms of Service
							</a>{" "}
							and{" "}
							<a href="privacy-policy" className="text-purple">
								Privacy Policy
							</a>
						</p>
					</div>
				</div>
			</form>
		</div>
	);
}

export default CreateAnAccount;
