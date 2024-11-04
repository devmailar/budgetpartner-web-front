import React, { type FormEvent, type ReactNode, useEffect, useState } from "react";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import ImagePiggy from "../../assets/piggy.webp";
import useAuthStore, { type IAuthState } from "../../stores/auth";
import useBudgetStore, { type IBudgetState } from "../../stores/budget";
import useBudgetsStore, { type IBudgetsState } from "../../stores/budgets";
import useLoaderStore from "../../stores/loader";
import usePopupStore from "../../stores/popup";
import useUserStore, { type IUserState } from "../../stores/user";
import type { IBudget, IResponseError, IUserResponse } from "../../types";
import { Utils } from "../../utils";

const Tour = (): ReactNode => {
	const navigate: NavigateFunction = useNavigate();

	const { setLoaderStore } = useLoaderStore();
	const { setPopupStore } = usePopupStore();

	const authStore: IAuthState["value"] = useAuthStore.getState().value;

	const setAuthStore: IAuthState["setAuthStore"] = useAuthStore.getState().setAuthStore;
	const setBudgetStore: IBudgetState["setBudgetStore"] = useBudgetStore.getState().setBudgetStore;
	const setBudgetsStore: IBudgetsState["setBudgetsStore"] = useBudgetsStore.getState().setBudgetsStore;
	const setUserStore: IUserState["setUserStore"] = useUserStore.getState().setUserStore;

	const [disableSubmit, setDisableSubmit] = useState<boolean>(false);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
		try {
			event.preventDefault();

			setDisableSubmit(true);

			const form: FormData = new FormData(event.currentTarget);
			const amount_monthly: number = Number.parseFloat(form.get("amount_monthly") as string);

			if (amount_monthly < 1 || !amount_monthly) {
				alert("Invalid income amount");

				setTimeout((): void => setDisableSubmit(false), 2500);

				return;
			}

			const getUserResponse: Response = await fetch(`${Utils.baseUrl}/users/get`, {
				method: "GET",
				headers: { Authorization: `Bearer ${authStore}` },
			});

			if (!getUserResponse.ok) {
				const getUserResponseError: IResponseError = await getUserResponse.json();

				throw new Error(getUserResponseError.message);
			}

			const getUserResponseBody: IUserResponse = await getUserResponse.json();

			const currentBudget: IBudget | undefined = getUserResponseBody.budgets.find((budget: IBudget): boolean => {
				return new Date(budget.created_at).getMonth() === new Date().getMonth();
			});

			if (!currentBudget) {
				throw new Error("No currentBudget");
			}

			const createIncomeResponse: Response = await fetch(`${Utils.baseUrl}/incomes/create`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${authStore}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					budget_uuid: currentBudget.uuid,
					type: "Salary",
					amount_monthly: amount_monthly,
					includes_weekends: false,
					date: new Date(),
				}),
			});

			if (!createIncomeResponse.ok) {
				const createIncomeResponseError: IResponseError = await createIncomeResponse.json();

				throw new Error(createIncomeResponseError.message);
			}

			const getUserResponseAgain: Response = await fetch(`${Utils.baseUrl}/users/get`, {
				method: "GET",
				headers: { Authorization: `Bearer ${authStore}` },
			});

			if (!getUserResponseAgain.ok) {
				const getUserResponseAgainError: IResponseError = await getUserResponseAgain.json();

				throw new Error(getUserResponseAgainError.message);
			}

			const getUserResponseAgainBody: IUserResponse = await getUserResponseAgain.json();

			if (Object.keys(getUserResponseAgainBody).length === 0) {
				throw new Error("User response again is empty");
			}

			setUserStore(getUserResponseAgainBody.user);
			setBudgetsStore(getUserResponseAgainBody.budgets);

			const currentBudgetAgain: IBudget | undefined = getUserResponseAgainBody.budgets.find(
				(budget: IBudget): boolean => {
					return new Date(budget.created_at).getMonth() === new Date().getMonth();
				},
			);

			if (!currentBudgetAgain) {
				return;
			}

			setBudgetStore(currentBudgetAgain);

			setLoaderStore(true);
			setTimeout((): void => setLoaderStore(false), 1500);

			navigate("/");

			setPopupStore({ install: true });
		} catch (error: unknown) {
			if (error instanceof Error) {
				setTimeout(() => setDisableSubmit(false), 2250);

				alert(error.message);
				throw new Error(error.stack);
			}
		}
	};

	useEffect((): void => {
		const handleCreateBudget = async (): Promise<void> => {
			try {
				const createBudgetResponse: Response = await fetch(`${Utils.baseUrl}/budgets/create`, {
					method: "POST",
					headers: {
						Authorization: `Bearer ${authStore}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ date: new Date() }),
				});

				if (!createBudgetResponse.ok) {
					const createBudgetResponseError: IResponseError = await createBudgetResponse.json();

					throw new Error(createBudgetResponseError.message);
				}
			} catch (error: unknown) {
				if (error instanceof Error) {
					alert(error.message);
					throw new Error(error.stack);
				}
			}
		};

		handleCreateBudget();
	}, [authStore]);

	return (
		<div className="flex justify-center">
			<div className="flex flex-col gap-y-6 w-full md:w-[40rem] animate__animated animate__slideInRight animate__faster">
				<nav className="flex items-center justify-between px-6 md:px-0 py-2.5 border-b border-b-[#313131]">
					<button
						type="button"
						onClick={(): void => {
							navigate("/");
						}}
					>
						<span className="text-lg text-[#007AFF] font-medium">Back</span>
					</button>

					<h2 className="text-lg text-white font-medium">BudgetPartner</h2>

					<button
						type="button"
						onClick={(): void => {
							setAuthStore("" as IAuthState["value"]);
							setBudgetStore({} as IBudgetState["value"]);
							setBudgetsStore([] as IBudgetsState["value"]);
							setUserStore({} as IUserState["value"]);

							navigate("/login");
						}}
					>
						<span className="text-lg text-[#007AFF] font-medium">Logout</span>
					</button>
				</nav>

				<form className="flex flex-col items-center px-6 md:px-0 py-12" onSubmit={handleSubmit}>
					<img src={ImagePiggy} alt={ImagePiggy} width={301} height={300} loading="lazy" fetchPriority="high" />

					<div className="flex flex-col gap-7 items-center">
						<div className="flex flex-col items-center justify-center gap-y-3">
							<h1 className="text-2xl font-semibold text-white">
								{Utils.monthsList[new Date().getMonth()]} ({new Date().getFullYear()})
							</h1>

							<p className="text-sm font-normal text-[#66666F] text-center">
								Set your start eg. salary to start a budget.
							</p>
						</div>

						<div className="flex items-center gap-2 px-4 py-3 bg-[#18181B] border border-[#212121] rounded-lg">
							<input
								className="bg-transparent text-base font-normal text-white placeholder:text-[#66666F] w-72 outline-none"
								type="text"
								name="amount_monthly"
								id="amount_monthly"
								placeholder="0.00"
								required
							/>
						</div>

						<div className="flex items-center justify-center w-full md:w-80 px-5 py-5 border-y border-y-[#313131]">
							<button
								type="submit"
								className={`btn bg-[#007AFF] w-full px-2 py-3 rounded-lg ${disableSubmit ? "opacity-40" : "opacity-100"}`}
								disabled={disableSubmit}
							>
								<span className="text-base font-medium text-white">Finish</span>
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Tour;
