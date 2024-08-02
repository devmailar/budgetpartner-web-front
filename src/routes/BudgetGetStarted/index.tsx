import type { Dispatch } from "@reduxjs/toolkit";
import React from "react";
import { useDispatch } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { getCookie } from "typescript-cookie";
import { setError } from "../../stores/Error";
import { setForceLogin } from "../../stores/ForceLogin";
import { setLoader } from "../../stores/Loader";
import type { IBudget, IResponseError, IUserResponse } from "../../types";
import { Utils } from "../../utils";

function BudgetGetStarted(): React.ReactNode {
	const dispatch: Dispatch = useDispatch();
	const navigate: NavigateFunction = useNavigate();

	const [step, setStep] = React.useState<number>(0);
	const [extraincomeModal, setExtraincomeModal] = React.useState<boolean>(false);

	const handleCreateBudget = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
		try {
			event.preventDefault();

			const auth: string = getCookie("Authorization") ?? "";
			if (!auth) {
				dispatch(setForceLogin(true));
				return;
			}

			const createBudgetResponse: Response = await fetch(`${Utils.baseurl}/budgets/create`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${auth}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ date: new Date() }),
			});

			if (!createBudgetResponse.ok) {
				const createBudgetResponseError: IResponseError = await createBudgetResponse.json();

				throw new Error(createBudgetResponseError.message);
			}

			setStep(1);
		} catch (error: unknown) {
			if (error instanceof Error) {
				dispatch(setError(error.message));
				navigate("/");
			}
		}
	};

	const handleCreateExtraincome = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		try {
			event.preventDefault();

			const form: FormData = new FormData(event.currentTarget);
			const income: number = Number.parseInt(form.get("income") as string);

			const auth: string = getCookie("Authorization") ?? "";
			if (!auth) {
				dispatch(setForceLogin(true));
				return;
			}

			const getUserResponse: Response = await fetch(`${Utils.baseurl}/users/get`, {
				method: "GET",
				headers: { Authorization: `Bearer ${auth}` },
			});

			if (!getUserResponse.ok) {
				const getUserResponseError: IResponseError = await getUserResponse.json();

				throw new Error(getUserResponseError.message);
			}

			const getUserResponseBody: IUserResponse = await getUserResponse.json();

			if (Object.keys(getUserResponseBody).length === 0) {
				throw new Error("User response is empty");
			}

			if (getUserResponseBody.budgets.length === 0) {
				throw new Error("Budgets response is empty");
			}

			const currentBudget: IBudget | undefined = getUserResponseBody.budgets.find((budget: IBudget): boolean => {
				return new Date(budget.created_at).getMonth() === new Date().getMonth();
			});

			if (!currentBudget) {
				throw new Error("Current budget is undefined");
			}

			if (Number.isNaN(income) || income <= 0) {
				throw new Error("Please enter valid amount");
			}

			const createExtraincomeResponse: Response = await fetch(`${Utils.baseurl}/extraincomes/create`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${auth}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					budget_id: currentBudget.id,
					extraincome_type: "Salary",
					extraincome_amount_monthly: income,
				}),
			});

			if (!createExtraincomeResponse.ok) {
				const createExtraincomeResponseError: IResponseError = await createExtraincomeResponse.json();

				throw new Error(createExtraincomeResponseError.message);
			}

			navigate("/");
		} catch (error: unknown) {
			if (error instanceof Error) {
				dispatch(setError(error.message));
			}
		}
	};

	React.useEffect((): void => {
		const auth: string = getCookie("Authorization") ?? "";
		if (!auth) {
			navigate("/login");
			return;
		}

		dispatch(setLoader(false));
	}, [dispatch, navigate]);

	return (
		<div className="flex items-center justify-center w-screen h-screen">
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
							{Utils.months[new Date().getMonth()]} {"("}
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
										What is your income for {Utils.months[new Date().getMonth()]}?
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
