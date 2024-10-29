import React, { type ReactNode } from "react";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { db } from "../../db";
import useAuthStore from "../../stores/auth";
import useBudgetStore from "../../stores/budget";
import useBudgetsStore from "../../stores/budgets";
import useUserStore from "../../stores/user";
import type { IBudget, IExtraexpense, IExtraincome, IResponseError, IUserResponse } from "../../types";
import { Utils } from "../../utils";

const Extraincomes = (): ReactNode => {
	const navigate: NavigateFunction = useNavigate();

	const { value: auth } = useAuthStore();
	const { value: budget, setBudgetStore } = useBudgetStore();
	const { setBudgetsStore } = useBudgetsStore();
	const { setUserStore } = useUserStore();

	const totalExtraincomes: number = budget?.extraincomes?.reduce(
		(accumulator: number, extraincome: IExtraincome) => accumulator + extraincome.amount_monthly,
		0,
	);

	const extraincomesSortedByCreatedAtAscending: IExtraincome[] = [...budget.extraincomes].sort((a, b): number => {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});

	const handleRemoveExtraincome = async (extraincome: IExtraincome): Promise<void> => {
		try {
			if (
				confirm(
					`Are you sure you want to remove income "${extraincome.type}" with amount ${extraincome.amount_monthly.toFixed(2)}${Utils.formatCurrencyFunction(budget.currency)}?`,
				)
			) {
				if (!auth) {
					await db.extraincomes.delete(extraincome.id);

					const budgets: IBudget[] = await db.budgets.toArray();
					if (budgets.length === 0) {
						await db.budgets.add({
							id: 1,
							user_id: 1,
							currency: "EUR",
							extraincomes: [],
							extraexpenses: [],
							created_at: new Date(),
							updated_at: new Date(),
						});

						return;
					}

					setBudgetStore(budgets[0]);

					const extraincomes: IExtraincome[] = await db.extraincomes.toArray();
					const extraexpenses: IExtraexpense[] = await db.extraexpenses.toArray();

					setBudgetStore({
						id: budgets[0].id,
						user_id: budgets[0].user_id,
						currency: budgets[0].currency,
						extraincomes: extraincomes,
						extraexpenses: extraexpenses,
						created_at: budgets[0].created_at,
						updated_at: budgets[0].updated_at,
					});

					return;
				}

				const removeExtraincomeResponse: Response = await fetch(
					`${Utils.baseUrl}/extraincomes/remove/${extraincome.id}`,
					{
						method: "DELETE",
						headers: { Authorization: `Bearer ${auth}` },
					},
				);

				if (!removeExtraincomeResponse.ok) {
					const removeExtraincomeResponseError: IResponseError = await removeExtraincomeResponse.json();

					throw new Error(removeExtraincomeResponseError.message);
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
					{totalExtraincomes ? totalExtraincomes.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ") : "0 00"}
					{Utils.formatCurrencyFunction(budget.currency)}
				</span>
			</div>

			<div className="flex flex-col gap-y-4">
				{extraincomesSortedByCreatedAtAscending.length > 0 ? (
					extraincomesSortedByCreatedAtAscending.map((extraincome: IExtraincome) => (
						<button
							type="button"
							key={extraincome.id}
							className="flex flex-col gap-y-0.5 btn px-0 py-0 w-full rounded-none"
							onClick={async (): Promise<void> => handleRemoveExtraincome(extraincome)}
						>
							<div className="flex items-center gap-x-2 w-full">
								<span className="text-sm text-[#66666F] font-bold font-rubik">
									{new Date(extraincome.date).toDateString()}
								</span>
								<hr className="flex-grow bg-[#66666F] h-[0.5px] border-none" />
							</div>
							<div className="flex items-center justify-between w-full">
								<span className="text-base text-[#91919A] font-bold font-rubik truncate">{extraincome.type}</span>
								<span className="text-base text-[#56AB4D] font-bold font-hanson truncate">
									+{extraincome.amount_monthly.toFixed(2)}
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
							<button type="button" onClick={(): void => navigate("/new-extraincome")}>
								<span className="text-[#009951] underline">Add new</span>
							</button>{" "}
							to add new income💡
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default Extraincomes;
