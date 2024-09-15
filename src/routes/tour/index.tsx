import type { Dispatch } from "@reduxjs/toolkit";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { setAuthStore } from "../../stores/auth";
import { setBudgetStore } from "../../stores/budget";
import { setBudgetsStore } from "../../stores/budgets";
import { setDialogStore } from "../../stores/dialog";
import { setUserStore } from "../../stores/user";
import type { IBudget, IResponseError, IRootState, IUserResponse } from "../../types";
import { Utils } from "../../utils";
import ImagePiggy from "../../assets/piggy.webp";

function Tour(): React.ReactNode {
	const dispatch: Dispatch = useDispatch();
	const navigate: NavigateFunction = useNavigate();

	const authStore: string = useSelector((state: IRootState) => state.auth);

	const [disableSubmit, setDisableSubmit] = React.useState<boolean>(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		try {
			event.preventDefault();

			setDisableSubmit(true);

			const form: FormData = new FormData(event.currentTarget);
			const extraincome_amount_monthly: number = Number.parseFloat(form.get("extraincome_amount_monthly") as string);

			if (extraincome_amount_monthly < 1 || !extraincome_amount_monthly) {
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

			const currentBudget: IBudget | undefined = getUserResponseBody.errorNoData.budgets.find(
				(budget: IBudget): boolean => {
					return new Date(budget.created_at).getMonth() === new Date().getMonth();
				},
			);

			if (!currentBudget) {
				throw new Error("No currentBudget");
			}

			const createExtraincomeResponse: Response = await fetch(`${Utils.baseUrl}/extraincomes/create`, {
				method: "POST",
				headers: { Authorization: `Bearer ${authStore}`, "Content-Type": "application/json" },
				body: JSON.stringify({
					budget_id: currentBudget.id,
					extraincome_type: "Salary",
					extraincome_amount_monthly: extraincome_amount_monthly,
					extraincome_includes_weekends: false,
					extraincome_date: new Date(),
				}),
			});

			if (!createExtraincomeResponse.ok) {
				const createExtraincomeResponseError: IResponseError = await createExtraincomeResponse.json();

				throw new Error(createExtraincomeResponseError.message);
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

			dispatch(setUserStore(getUserResponseAgainBody.errorNoData.user));
			dispatch(setBudgetsStore(getUserResponseAgainBody.errorNoData.budgets));

			const currentBudgetAgain: IBudget | undefined = getUserResponseAgainBody.errorNoData.budgets.find(
				(budget: IBudget): boolean => {
					return new Date(budget.created_at).getMonth() === new Date().getMonth();
				},
			);

			dispatch(setBudgetStore(currentBudgetAgain));

			navigate("/");
		} catch (error: unknown) {
			if (error instanceof Error) {
				alert(error.message);

				setTimeout(() => setDisableSubmit(false), 2250);
			}
		}
	};

	React.useEffect((): void => {
		const handleCreateBudget = async (): Promise<void> => {
			try {
				const createBudgetResponse: Response = await fetch(`${Utils.baseUrl}/budgets/create`, {
					method: "POST",
					headers: { Authorization: `Bearer ${authStore}`, "Content-Type": "application/json" },
					body: JSON.stringify({ date: new Date() }),
				});

				if (!createBudgetResponse.ok) {
					const createBudgetResponseError: IResponseError = await createBudgetResponse.json();

					throw new Error(createBudgetResponseError.message);
				}
			} catch (error: unknown) {
				if (error instanceof Error) {
					alert(error.message);
				}
			}
		};

		handleCreateBudget();
	}, [authStore]);

	return (
		<div className="h-screen animate__animated animate__slideInRight animate__faster">
			<nav className="flex items-center justify-between px-5 py-2.5 border-b border-b-[#313131]">
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
						dispatch(setAuthStore(""));
						dispatch(setBudgetStore({}));
						dispatch(setBudgetsStore([]));
						dispatch(setUserStore({}));
						dispatch(setDialogStore({ extraincomes: false, extraexpenses: false }));

						navigate("/login");
					}}
				>
					<span className="text-lg text-[#007AFF] font-medium">Logout</span>
				</button>
			</nav>

			<form className="flex flex-col items-center px-6 py-12" onSubmit={handleSubmit}>
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
							name="extraincome_amount_monthly"
							id="extraincome_amount_monthly"
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
	);
}

export default Tour;
