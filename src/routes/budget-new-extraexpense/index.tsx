import { format } from "date-fns";
import React, { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/auth";
import useBudgetStore from "../../stores/budget";
import useBudgetsStore from "../../stores/budgets";
import useUserStore from "../../stores/user";
import type { IBudget, IResponseError, IUserResponse } from "../../types";
import { Utils } from "../../utils";

const BudgetNewExtraexpense = (): ReactNode => {
	const navigate: NavigateFunction = useNavigate();

	const { value: auth } = useAuthStore();
	const { value: budget, setBudgetStore } = useBudgetStore();
	const { setBudgetsStore } = useBudgetsStore();
	const { setUserStore } = useUserStore();

	const [extraexpenseDate, setExtraexpenseDate] = useState<Date>(new Date());
	const [disableSubmit, setDisableSubmit] = useState<boolean>(false);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
		try {
			event.preventDefault();

			setDisableSubmit(true);

			const form: FormData = new FormData(event.currentTarget);
			const type: string = form.get("type") as string;
			const amount_monthly: number = Number.parseFloat(form.get("amount_monthly") as string);

			if (amount_monthly < 1 || !amount_monthly) {
				alert("Invalid expense amount");
				setTimeout((): void => setDisableSubmit(false), 2500);
				return;
			}

			const createExtraexpenseResponse: Response = await fetch(`${Utils.baseUrl}/extraexpenses/create`, {
				method: "POST",
				headers: { Authorization: `Bearer ${auth}`, "Content-Type": "application/json" },
				body: JSON.stringify({
					budget_id: budget.id,
					type: type,
					amount_monthly: amount_monthly,
					date: extraexpenseDate,
				}),
			});

			if (!createExtraexpenseResponse.ok) {
				const createExtraexpenseResponseError: IResponseError = await createExtraexpenseResponse.json();

				throw new Error(createExtraexpenseResponseError.message);
			}

			const getUserResponse: Response = await fetch(`${Utils.baseUrl}/users/get`, {
				method: "GET",
				headers: { Authorization: `Bearer ${auth}` },
			});

			if (!getUserResponse.ok) {
				const getUserResponseError: IResponseError = await getUserResponse.json();

				throw new Error(getUserResponseError.message);
			}

			const getUserResponseBody: IUserResponse = await getUserResponse.json();

			setUserStore(getUserResponseBody.errorNoData.user);
			setBudgetsStore(getUserResponseBody.errorNoData.budgets);

			const currentBudget: IBudget | undefined = getUserResponseBody.errorNoData.budgets.find(
				(budget: IBudget): boolean => {
					return new Date(budget.created_at).getMonth() === new Date().getMonth();
				},
			);

			if (!currentBudget) {
				return;
			}

			setBudgetStore(currentBudget);

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
		<div className="h-screen animate__animated animate__slideInRight animate__faster">
			<nav className="flex items-center justify-between px-5 py-2.5 border-b border-b-[#313131]">
				<h2 className="text-lg text-white font-medium">BudgetPartner</h2>

				<button type="button" onClick={(): void => navigate("/")}>
					<span className="text-lg text-[#007AFF] font-medium">Back</span>
				</button>
			</nav>

			<form className="flex flex-col gap-7 items-center px-6 py-12" onSubmit={handleSubmit}>
				<h2 className="text-2xl font-semibold text-white">New Expense</h2>

				<div className="flex flex-col gap-y-3">
					<div className="flex items-center gap-2 px-4 py-3 bg-[#18181B] border border-[#212121] rounded-lg">
						<svg width={24} height={24} fill="none" viewBox="0 0 24 24">
							<title>Description</title>
							<path
								stroke="#66666F"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M14 3V7C14 7.26522 14.1054 7.51957 14.2929 7.70711C14.4804 7.89464 14.7348 8 15 8H19"
							/>
							<path
								stroke="#66666F"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M17 21H7C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H14L19 8V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21Z"
							/>
							<path stroke="#66666F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M9 17H15" />
							<path stroke="#66666F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M9 13H15" />
						</svg>

						<input
							className="bg-transparent text-base font-normal text-white placeholder:text-[#66666F] w-72 outline-none"
							type="text"
							name="type"
							id="type"
							placeholder="Expense"
							required
						/>
					</div>

					<div className="flex items-center gap-3.5 px-4 py-3 bg-[#18181B] border border-[#212121] rounded-lg">
						<span className="ml-1 text-xl text-[#66666F]">{Utils.formatCurrencyFunction(budget.currency)}</span>

						<input
							className="bg-transparent text-base font-normal text-white placeholder:text-[#66666F] w-72 outline-none"
							type="text"
							name="amount_monthly"
							id="amount_monthly"
							placeholder="0.00"
							required
						/>
					</div>

					<div className="flex items-center gap-2 px-4 py-3 bg-[#18181B] border border-[#212121] rounded-lg">
						<svg width={24} height={24} fill="none" viewBox="0 0 24 24">
							<title>Calendar</title>
							<path
								stroke="#66666F"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M4 7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H18C18.5304 5 19.0391 5.21071 19.4142 5.58579C19.7893 5.96086 20 6.46957 20 7V19C20 19.5304 19.7893 20.0391 19.4142 20.4142C19.0391 20.7893 18.5304 21 18 21H6C5.46957 21 4.96086 20.7893 4.58579 20.4142C4.21071 20.0391 4 19.5304 4 19V7Z"
							/>
							<path stroke="#66666F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M16 3V7" />
							<path stroke="#66666F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M8 3V7" />
							<path stroke="#66666F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M4 11H20" />
							<path
								stroke="#66666F"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M8 15H10V17H8V15Z"
							/>
						</svg>

						<input
							className="bg-transparent text-base font-normal text-white placeholder:text-[#66666F] outline-none"
							type="date"
							name="date"
							id="date"
							value={format(extraexpenseDate, "yyyy-MM-dd")}
							required
							onChange={(e: ChangeEvent<HTMLInputElement>): void => setExtraexpenseDate(new Date(e.target.value))}
						/>
					</div>
				</div>

				<div className="flex items-center justify-center w-full md:w-80 px-5 py-5 border-y border-y-[#313131]">
					<button
						type="submit"
						className={`btn bg-[#B85C3D] w-full px-2 py-3 rounded-lg ${disableSubmit ? "opacity-40" : "opacity-100"}`}
						disabled={disableSubmit}
					>
						<span className="text-base font-medium text-white">Add new expense</span>
					</button>
				</div>
			</form>
		</div>
	);
};

export default BudgetNewExtraexpense;
