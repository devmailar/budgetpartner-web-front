import type { Dispatch } from "@reduxjs/toolkit";
import type React from "react";
import { useDispatch, useSelector } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { setBudgetStore } from "../../stores/budget";
import { setBudgetsStore } from "../../stores/budgets";
import { setDialogStore } from "../../stores/dialog";
import { setUserStore } from "../../stores/user";
import type { IBudget, IExtraexpense, IResponseError, IRootState, IUserResponse } from "../../types";
import { Utils } from "../../utils";

function ExtraexpensesDialog(): React.ReactNode {
	const dispatch: Dispatch = useDispatch();
	const navigate: NavigateFunction = useNavigate();

	const authStore: string = useSelector((state: IRootState) => state.auth);
	const budgetStore: IBudget = useSelector((state: IRootState) => state.budget);

	const totalExtraexpenses: number = budgetStore?.extraexpenses?.reduce(
		(accumulator: number, extraexpense: IExtraexpense) => {
			return accumulator + extraexpense.extraexpense_amount_monthly;
		},
		0,
	);

	const extraexpensesSortedByExpenseDateAscending: IExtraexpense[] = [...budgetStore.extraexpenses].sort((a, b) => {
		return new Date(b.extraexpense_date).getTime() - new Date(a.extraexpense_date).getTime();
	});

	return (
		<div className="flex flex-col gap-4 absolute bottom-0 bg-[#18181B] w-full h-[64%] px-7 pb-5 border border-[#212121] rounded-3xl">
			<button
				type="button"
				className="flex items-center justify-center pt-[18px]"
				onClick={(): void => {
					dispatch(
						setDialogStore({
							extraincomes: false,
							extraexpenses: false,
						}),
					);
				}}
			>
				<button
					type="button"
					className="w-[125px] h-[5px] bg-white rounded-lg"
					onClick={(): void => {
						dispatch(
							setDialogStore({
								extraincomes: false,
								extraexpenses: false,
							}),
						);
					}}
				/>
			</button>

			<div className="flex items-center justify-between">
				<span className="text-base text-[#B85C3D] font-semibold">Total Expenses</span>
				<span className="text-lg text-white font-bold">
					{totalExtraexpenses ? totalExtraexpenses.toFixed(2) : "···"}
					{Utils.formatCurrencyFunction(budgetStore.currency)}
				</span>

				<div className="flex">
					<button
						type="button"
						className="btn bg-transparent"
						onClick={() => {
							navigate("/new-extraexpense");
						}}
					>
						<span className="text-base text-[#B85C3D] font-semibold">+ Add new</span>
					</button>
				</div>
			</div>

			<div className="h-72 md:h-[40rem] overflow-scroll">
				{extraexpensesSortedByExpenseDateAscending.length > 0 &&
					extraexpensesSortedByExpenseDateAscending.map((extraexpense: IExtraexpense, index: number) => (
						<button
							type="button"
							key={extraexpense.id}
							className="btn bg-transparent flex items-center justify-between w-full px-1.5 py-1.5 md:py-2.5 border-y border-y-[#313131] rounded-none"
							onClick={async (): Promise<void> => {
								if (
									confirm(
										`Are you sure you want to remove expense "${extraexpense.extraexpense_type}" with amount ${extraexpense.extraexpense_amount_monthly.toFixed(2)}${Utils.formatCurrencyFunction(budgetStore.currency)}?`,
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
							}}
						>
							<span className="text-sm md:text-base text-[#B85C3D] text-left w-6 font-normal">{index + 1}</span>
							<span className="text-sm md:text-base text-[#BEBEC2] text-left w-32 truncate">
								{extraexpense.extraexpense_type}
							</span>

							<span className="text-sm md:text-base text-[#BEBEC2] text-left w-20 font-normal">
								{extraexpense.extraexpense_amount_monthly.toFixed(2)}
								{Utils.formatCurrencyFunction(budgetStore.currency)}
							</span>

							<span className="text-sm md:text-base text-[#BEBEC2] text-left w-20 font-normal">
								{new Date(extraexpense.extraexpense_date).toLocaleDateString()}
							</span>
						</button>
					))}
			</div>
		</div>
	);
}

export default ExtraexpensesDialog;
