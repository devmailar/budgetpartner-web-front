import type { Dispatch } from "@reduxjs/toolkit";
import React from "react";
import { useDispatch } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { setError } from "../../stores/Error";
import type { IResponseError } from "../../types";

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

			const createBudgetResponse: Response = await fetch("http://localhost:8080/users/create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: email, password: password }),
			});

			if (!createBudgetResponse.ok) {
				const createBudgetResponseError: IResponseError = await createBudgetResponse.json();

				throw new Error(createBudgetResponseError.message);
			}

			navigate("/budget");
		} catch (error: unknown) {
			if (error instanceof Error) {
				dispatch(setError(error.message));
				setTimeout(() => setIsLoading(false), 2500);
			}
		}
	};

	return (
		<div className="flex items-center justify-center bg-radial-gradient w-screen h-screen">
			<form className="flex flex-col gap-y-4 w-[26rem]" onSubmit={handleCreate}>
				<div className="flex flex-col gap-y-5">
					<div className="flex flex-col gap-y-1 items-center">
						<h1 className="text-2xl text-white font-medium font-rubik">Create an account</h1>
						<p className="text-base text-white font-normal font-rubik">Enter your email to sign up for this app</p>
					</div>

					<div className="flex flex-col gap-y-3">
						<input
							className="bg-transparent border-purple border-2 p-2 text-xl text-white font-normal font-rubik rounded-lg"
							type="email"
							id="email"
							name="email"
							placeholder="support@budget-partner.com"
							autoComplete="email"
							required
						/>

						<input
							className="bg-transparent border-purple border-2 p-2 text-xl text-white font-normal font-rubik rounded-lg"
							type="password"
							id="password"
							name="password"
							placeholder="**************"
							autoComplete="password"
							required
						/>
					</div>
				</div>

				<div className="flex flex-col gap-y-3">
					<input
						className="btn bg-purple text-sm text-white font-medium py-2.5 rounded-lg"
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
