import React, { type ReactNode } from "react";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../db";
import useAuthStore from "../../stores/auth";
import useBudgetStore from "../../stores/budget";
import useBudgetsStore from "../../stores/budgets";
import useUserStore from "../../stores/user";
import type { IBudget, IExpense, IIncome, IResponseError, IUserResponse } from "../../types";
import { Utils } from "../../utils";

const Incomes = (): ReactNode => {
	const navigate: NavigateFunction = useNavigate();

	const { value: auth } = useAuthStore();
	const { value: budget, setBudgetStore } = useBudgetStore();
	const { setBudgetsStore } = useBudgetsStore();
	const { setUserStore } = useUserStore();

	if (!budget || !budget.incomes) {
		throw new Error();
	}

	const totalIncomes: number = budget?.incomes?.reduce(
		(accumulator: number, income: IIncome) => accumulator + income.amount_monthly,
		0,
	);

	const incomesSortedByCreatedAtAscending: IIncome[] = [...budget.incomes].sort((a, b): number => {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});

	const handleRemoveIncome = async (income: IIncome): Promise<void> => {
		try {
			if (
				confirm(
					`Are you sure you want to remove income "${income.type}" with amount ${income.amount_monthly.toFixed(2)}${Utils.formatCurrencyFunction(budget.currency)}?`,
				)
			) {
				if (!auth) {
					await db.incomes.delete(income.id);

					const budgets: IBudget[] = await db.budgets.toArray();
					if (budgets.length === 0) {
						await db.budgets.add({
							id: 1,
							uuid: uuidv4(),
							user_uuid: uuidv4(),
							currency: "EUR",
							incomes: [],
							expenses: [],
							created_at: new Date(),
							updated_at: new Date(),
						});

						return;
					}

					setBudgetStore(budgets[0]);

					const incomes: IIncome[] = await db.incomes.toArray();
					const expenses: IExpense[] = await db.expenses.toArray();

					setBudgetStore({
						id: budgets[0].id,
						uuid: budgets[0].uuid,
						user_uuid: budgets[0].user_uuid,
						currency: budgets[0].currency,
						incomes: incomes,
						expenses: expenses,
						created_at: budgets[0].created_at,
						updated_at: budgets[0].updated_at,
					});

					return;
				}

				const removeIncomeResponse: Response = await fetch(`${Utils.baseUrl}/incomes/remove/${income.id}`, {
					method: "DELETE",
					headers: { Authorization: `Bearer ${auth}` },
				});

				if (!removeIncomeResponse.ok) {
					const removeIncomeResponseError: IResponseError = await removeIncomeResponse.json();

					throw new Error(removeIncomeResponseError.message);
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

				setUserStore(getUserResponseBody.user);
				setBudgetsStore(getUserResponseBody.budgets);

				const currentBudget: IBudget | undefined = getUserResponseBody.budgets.find((budget: IBudget): boolean => {
					return new Date(budget.created_at).getMonth() === new Date().getMonth();
				});

				if (!currentBudget) {
					return;
				}

				setBudgetStore(currentBudget);
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				alert(error.message);
				throw new Error(error.stack);
			}
		}
	};

	return (
		<div className="flex flex-col gap-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-base text-white font-bold font-rubik">Total Income</h2>
				<span className="text-base text-white font-bold font-hanson">
					{totalIncomes ? totalIncomes.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ") : "0 00"}
					{Utils.formatCurrencyFunction(budget.currency)}
				</span>
			</div>

			<div className="flex flex-col gap-y-4">
				{incomesSortedByCreatedAtAscending.length > 0 ? (
					incomesSortedByCreatedAtAscending.map((income: IIncome) => (
						<button
							type="button"
							key={income.id}
							className="flex flex-col gap-y-0.5 btn px-0 py-0 w-full rounded-none"
							onClick={async (): Promise<void> => handleRemoveIncome(income)}
						>
							<div className="flex items-center gap-x-2 w-full">
								<span className="text-sm text-[#66666F] font-bold font-rubik">
									{new Date(income.date).toDateString()}
								</span>
								<hr className="flex-grow bg-[#66666F] h-[0.5px] border-none" />
							</div>
							<div className="flex items-center justify-between w-full">
								<span className="text-base text-[#91919A] font-bold font-rubik truncate">{income.type}</span>
								<span className="text-base text-[#56AB4D] font-bold font-hanson truncate">
									+{income.amount_monthly.toFixed(2)}
									{Utils.formatCurrencyFunction(budget.currency)}
								</span>
							</div>
						</button>
					))
				) : (
					<div className="flex items-center justify-center">
						<p className="text-base text-[#66666F] font-medium text-center">
							it looks super empty here🤔
							<br />
							<br />
							click{" "}
							<button type="button" onClick={(): void => navigate("/new-income")}>
								<span className="text-[#009951] underline">Add new</span>
							</button>{" "}
							to add new income��
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default Incomes;
