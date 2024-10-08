import type { Dispatch } from "@reduxjs/toolkit";
import React, { type ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { setBudgetStore } from "../../stores/budget";
import { setBudgetsStore } from "../../stores/budgets";
import { setUserStore } from "../../stores/user";
import type { IBudget, IExtraexpense, IResponseError, IRootState, IUserResponse } from "../../types";
import { Utils } from "../../utils";

const BudgetExtraexpenses = (): ReactNode => {
	const dispatch: Dispatch = useDispatch();
	const navigate: NavigateFunction = useNavigate();

	const authStore: string = useSelector((state: IRootState) => state.auth);
	const budgetStore: IBudget = useSelector((state: IRootState) => state.budget);

	const totalExtraexpenses: number = budgetStore?.extraexpenses?.reduce(
		(accumulator: number, extraexpense: IExtraexpense) => {
			return accumulator + extraexpense.amount_monthly;
		},
		0,
	);

	const extraexpensesSortedByCreatedAtAscending: IExtraexpense[] = [...budgetStore.extraexpenses].sort(
		(a, b): number => {
			return new Date(b.date).getTime() - new Date(a.date).getTime();
		},
	);

	const handleRemoveExtraexpense = async (extraexpense: IExtraexpense): Promise<void> => {
		try {
			if (
				confirm(
					`Are you sure you want to remove expense "${extraexpense.type}" with amount ${extraexpense.amount_monthly.toFixed(2)}${Utils.formatCurrencyFunction(budgetStore.currency)}?`,
				)
			) {
				const removeExtraexpenseResponse: Response = await fetch(
					`${Utils.baseUrl}/extraexpenses/remove/${extraexpense.id}`,
					{
						method: "DELETE",
						headers: { Authorization: `Bearer ${authStore}` },
					},
				);

				if (!removeExtraexpenseResponse.ok) {
					const removeExtraexpenseResponseError: IResponseError = await removeExtraexpenseResponse.json();

					throw new Error(removeExtraexpenseResponseError.errorMessage);
				}

				const getUserResponse: Response = await fetch(`${Utils.baseUrl}/users/get`, {
					method: "GET",
					headers: { Authorization: `Bearer ${authStore}` },
				});

				if (!getUserResponse.ok) {
					const getUserResponseError: IResponseError = await getUserResponse.json();

					throw new Error(getUserResponseError.errorMessage);
				}

				const getUserResponseBody: IUserResponse = await getUserResponse.json();

				dispatch(setUserStore(getUserResponseBody.errorNoData.user));
				dispatch(setBudgetsStore(getUserResponseBody.errorNoData.budgets));

				const currentBudget: IBudget | undefined = getUserResponseBody.errorNoData.budgets.find(
					(budget: IBudget): boolean => {
						return new Date(budget.created_at).getMonth() === new Date().getMonth();
					},
				);

				dispatch(setBudgetStore(currentBudget));
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				alert(error.message);
			}
		}
	};

	return (
		<div className="animate__animated animate__slideInRight animate__faster flex flex-col gap-y-6 px-7 py-7">
			<div className="flex gap-x-3 items-center justify-end h-[26px]">
				<button
					type="button"
					className="bg-[#B85C3D] h-full px-2 py-0 rounded-2xl"
					onClick={(): void => {
						navigate("/new-extraexpense");
					}}
				>
					<span className="text-base text-white font-medium">+ Add new</span>
				</button>

				<button
					type="button"
					className="bg-[#1B1818] h-full px-6 py-0 rounded-2xl"
					onClick={(): void => {
						navigate("/");
					}}
				>
					<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
						<title>Close</title>
						<path
							d="M14 1.16049L13.1045 0L7 5.97531L0.895476 0L0 1.16049L5.96256 7L0 12.8395L0.895476 14L7 8.02469L13.1045 14L14 12.8395L8.03744 7L14 1.16049Z"
							fill="white"
						/>
					</svg>
				</button>
			</div>

			<div className="flex flex-col gap-y-3">
				<div className="flex items-center justify-between">
					<span className="text-xl text-white font-semibold">Total Expenses</span>
					<span className="text-xl text-white font-bold">
						{totalExtraexpenses ? totalExtraexpenses.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ") : "···"}
						{Utils.formatCurrencyFunction(budgetStore.currency)}
					</span>
				</div>

				<div className="flex flex-col gap-y-4 h-[30rem] overflow-y-scroll">
					{extraexpensesSortedByCreatedAtAscending.length > 0 &&
						extraexpensesSortedByCreatedAtAscending.map((extraexpense: IExtraexpense) => (
							<button
								type="button"
								key={extraexpense.id}
								className="flex flex-col gap-y-1 btn px-0 py-0 w-full rounded-none"
								onClick={(): Promise<void> => handleRemoveExtraexpense(extraexpense)}
							>
								<div className="flex items-center gap-x-2 w-full">
									<span className="text-base text-[#66666F] font-normal">
										{new Date(extraexpense.date).toDateString()}
									</span>

									<hr className="flex-grow bg-[#66666F] text-[#66666F] h-[0.5px] border-none" />
								</div>

								<div className="flex items-center justify-between w-full">
									<span className="text-lg text-[#91919A] font-medium truncate">{extraexpense.type}</span>
									<span className="text-lg text-[#B85C3D] font-medium truncate">
										-{extraexpense.amount_monthly.toFixed(2)}
										{Utils.formatCurrencyFunction(budgetStore.currency)}
									</span>
								</div>
							</button>
						))}
				</div>
			</div>
		</div>
	);
};

export default BudgetExtraexpenses;
