import type { Dispatch } from "@reduxjs/toolkit";
import type React from "react";
import { useDispatch, useSelector } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { setBudgetStore } from "../../stores/budget";
import { setBudgetsStore } from "../../stores/budgets";
import { setDialogStore } from "../../stores/dialog";
import { setUserStore } from "../../stores/user";
import type { IBudget, IExtraincome, IResponseError, IRootState, IUserResponse } from "../../types";
import { Utils } from "../../utils";

function ExtraincomesDialog(): React.ReactNode {
	const dispatch: Dispatch = useDispatch();
	const navigate: NavigateFunction = useNavigate();

	const authStore: string = useSelector((state: IRootState) => state.auth);
	const budgetStore: IBudget = useSelector((state: IRootState) => state.budget);

	const totalExtraincomes: number = budgetStore?.extraincomes?.reduce(
		(accumulator: number, extraincome: IExtraincome) => {
			return accumulator + extraincome.amount_monthly;
		},
		0,
	);

	const extraincomesSortedByCreatedAtAscending: IExtraincome[] = [...budgetStore.extraincomes].sort((a, b) => {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});

	return (
		<div className="animate__animated animate__slideInLeft animate__faster flex flex-col gap-y-6 absolute bottom-0 bg-black w-full h-[80%] md:h-[90%] px-7 pb-5 border border-[#212121] rounded-3xl">
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

			<div className="flex gap-x-3 items-center justify-end h-[26px]">
				<button
					type="button"
					className="bg-[#007AFF] h-full px-2 py-0 rounded-2xl"
					onClick={(): void => {
						navigate("/new-extraincome");
					}}
				>
					<span className="text-base text-white font-medium">+ Add new</span>
				</button>

				<button
					type="button"
					className="bg-[#1B1818] h-full px-6 py-0 rounded-2xl"
					onClick={(): void => {
						dispatch(
							setDialogStore({
								extraincomes: false,
								extraexpenses: false,
							}),
						);
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
					<span className="text-xl text-white font-semibold">Total Income</span>
					<span className="text-xl text-white font-bold">
						{totalExtraincomes ? totalExtraincomes.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ") : "···"}
						{Utils.formatCurrencyFunction(budgetStore.currency)}
					</span>
				</div>

				<div className="flex flex-col gap-y-4 h-72 md:h-[40rem] overflow-scroll">
					{extraincomesSortedByCreatedAtAscending.length > 0 &&
						extraincomesSortedByCreatedAtAscending.map((extraincome: IExtraincome, index: number) => (
							<button
								type="button"
								key={extraincome.id}
								className="flex flex-col gap-y-1 btn px-0 py-0 w-full rounded-none"
								onClick={async (): Promise<void> => {
									if (
										confirm(
											`Are you sure you want to remove income "${extraincome.type}" with amount ${extraincome.amount_monthly.toFixed(2)}${Utils.formatCurrencyFunction(budgetStore.currency)}?`,
										)
									) {
										const removeExtraincomeResponse: Response = await fetch(
											`${Utils.baseUrl}/extraincomes/remove/${extraincome.id}`,
											{
												method: "DELETE",
												headers: { Authorization: `Bearer ${authStore}` },
											},
										);

										if (!removeExtraincomeResponse.ok) {
											const removeExtraincomeResponseError: IResponseError = await removeExtraincomeResponse.json();

											throw new Error(removeExtraincomeResponseError.errorMessage);
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
								<div className="flex items-center gap-x-2 w-full">
									<span className="text-base text-[#66666F] font-normal">
										{new Date(extraincome.date).toDateString()}
									</span>

									<hr className="flex-grow bg-[#66666F] text-[#66666F] h-[0.5px] border-none" />
								</div>

								<div className="flex items-center justify-between w-full">
									<span className="text-lg text-[#91919A] font-medium truncate">{extraincome.type}</span>
									<span className="text-lg text-[#007AFF] font-medium truncate">
										+{extraincome.amount_monthly.toFixed(2)}
										{Utils.formatCurrencyFunction(budgetStore.currency)}
									</span>
								</div>
							</button>
						))}
				</div>
			</div>
		</div>
	);
}

export default ExtraincomesDialog;
