import type { Dispatch } from "@reduxjs/toolkit";
import type { KyResponse } from "ky";
import { type FormEvent, type MouseEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { getCookie } from "typescript-cookie";
import { setError } from "../../stores/Error";
import type { IUserResponse, TBudget } from "../../types";
import { Utils, months } from "../../utils";

function BudgetGetStarted() {
	const dispatch: Dispatch = useDispatch();
	const navigate: NavigateFunction = useNavigate();

	const [step, setStep] = useState<number>(0);
	const [extraincomeModal, setExtraincomeModal] = useState<boolean>(false);

	const handleCreateBudget = async (event: MouseEvent<HTMLButtonElement>): Promise<void> => {
		try {
			event.preventDefault();

			const authorization: string | undefined = getCookie("Authorization");
			if (!authorization) {
				throw new Error("Please login to continue");
			}

			await Utils.request.post("budgets/create", {
				headers: {
					Authorization: `Bearer ${authorization}`,
				},
			});

			return setStep(1);
		} catch (error: unknown) {
			if (error instanceof Error) {
				dispatch(setError(`Budget for ${months[new Date().getMonth()]} already exists !`));
			}
		}
	};

	const handleCreateExtraincome = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
		try {
			event.preventDefault();
			dispatch(setError(""));

			const form: FormData = new FormData(event.currentTarget);
			const income: number = Number.parseInt(form.get("income") as string);

			const authorization: string = getCookie("Authorization") ?? "";
			if (!authorization) {
				throw new Error("Please login to continue");
			}

			const response: KyResponse = await Utils.request.get("users/get", {
				headers: {
					Authorization: `Bearer ${authorization}`,
				},
			});

			if (!response.ok) {
				return;
			}

			const userResponse: IUserResponse = await response.json();

			if (Object.keys(userResponse).length === 0) {
				throw new Error("User response is empty");
			}

			if (userResponse.budgets.length === 0) {
				throw new Error("Budgets response is empty");
			}

			const currentBudget: TBudget | undefined = userResponse.budgets.find((budget: TBudget): boolean => {
				return new Date(budget.created_at).getMonth() === new Date().getMonth();
			});

			if (!currentBudget) {
				throw new Error("Current budget is undefined");
			}

			if (Number.isNaN(income) || income <= 0) {
				throw new Error("Please enter valid amount");
			}

			await Utils.request.post("extraincomes/create", {
				headers: {
					Authorization: `Bearer ${authorization}`,
				},
				json: {
					budget_id: currentBudget.id,
					extraincome_type: "Salary",
					extraincome_amount_monthly: income,
				},
			});

			navigate("/budget");
		} catch (error: unknown) {
			if (error instanceof Error) {
				dispatch(setError(error.message));
			}
		}
	};

	useEffect((): void => {
		const authorization: string | undefined = getCookie("Authorization");

		if (!authorization) {
			navigate("/");
		}
	}, [navigate]);

	return (
		<div className="flex items-center justify-center bg-radial-gradient w-screen h-screen">
			{step === 0 && (
				<div className="flex flex-col gap-y-6 justify-center w-[400px]">
					<div className="flex flex-col gap-y-1 items-center">
						<img
							src="https://ucarecdn.com/5be54da1-0bf6-4d18-8209-07fe1c228ddc/-/preview/512x512/"
							alt="BG"
							width="160"
							height="160"
						/>

						<h1 className="text-2xl text-white font-medium font-rubik">Setup budget</h1>

						<p className="text-sm text-white font-normal font-rubik text-center">
							We’ll guide you through the steps of setting up your budget.
						</p>
					</div>

					<button type="button" className="btn bg-purple py-2 rounded-lg" onClick={handleCreateBudget}>
						<span className="text-sm text-white font-medium font-rubik">Get started</span>
					</button>
				</div>
			)}

			{step === 1 && (
				<div className="flex flex-col gap-y-6 justify-center w-[400px]">
					<div className="flex flex-col gap-y-1 items-center">
						<img
							src="https://ucarecdn.com/683b3c65-2bfe-4667-bc9d-998ff4d11f36/-/preview/174x173/"
							alt="BG"
							width="160"
							height="160"
						/>

						<h1 className="text-2xl text-white font-medium font-rubik">
							{months[new Date().getMonth()]} {"("}
							<span className="font-semibold">{new Date().getFullYear()}</span>
							{")"}
						</h1>

						<p className="text-sm text-white font-normal font-rubik">Set your income to start a budget.</p>
					</div>

					<div className="flex flex-col gap-y-2 mx-6">
						<button
							type="button"
							className={`btn ${extraincomeModal ? "bg-grey" : "bg-purple"} py-2 rounded-lg`}
							onClick={(): void => setExtraincomeModal(true)}
							disabled={extraincomeModal}
						>
							<span className="text-sm text-white font-medium font-rubik">Set income</span>
						</button>

						{extraincomeModal && (
							<form className="flex flex-col gap-y-6 px-4 py-6 bg-darker rounded-lg" onSubmit={handleCreateExtraincome}>
								<div className="flex flex-col gap-y-6">
									<span className="text-sm text-white font-medium font-rubik">
										What is your income for {months[new Date().getMonth()]}?
									</span>

									<div className="flex flex-col gap-y-3">
										<div className="flex gap-x-4 items-center justify-between p-2 border-[1px] border-grey rounded-lg">
											<input
												className="bg-transparent w-full text-sm text-white placeholder:text-white font-light font-rubik focus:outline-none"
												type="number"
												name="income"
												id="income"
												placeholder="0.00"
												required
											/>

											<span className="text-xs text-white font-light font-rubik">EUR/MONTH</span>
										</div>
									</div>
								</div>

								<button type="submit" className="btn bg-purple py-2 rounded-lg">
									<span className="text-xs text-white font-medium font-rubik">Save</span>
								</button>
							</form>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

export default BudgetGetStarted;
