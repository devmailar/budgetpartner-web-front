import React, { type ReactNode } from "react";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/auth";
import useBudgetStore from "../../stores/budget";
import useBudgetsStore from "../../stores/budgets";
import useUserStore from "../../stores/user";
import type { IBudget, IExtraincome, IResponseError, IUserResponse } from "../../types";
import { Utils } from "../../utils";

const BudgetExtraincomes = (): ReactNode => {
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
				const removeExtraincomeResponse: Response = await fetch(
					`${Utils.baseUrl}/extraincomes/remove/${extraincome.id}`,
					{
						method: "DELETE",
						headers: { Authorization: `Bearer ${auth}` },
					},
				);

				if (!removeExtraincomeResponse.ok) {
					const removeExtraincomeResponseError: IResponseError = await removeExtraincomeResponse.json();

					throw new Error(removeExtraincomeResponseError.errorMessage);
				}

				const getUserResponse: Response = await fetch(`${Utils.baseUrl}/users/get`, {
					method: "GET",
					headers: { Authorization: `Bearer ${auth}` },
				});

				if (!getUserResponse.ok) {
					const getUserResponseError: IResponseError = await getUserResponse.json();

					throw new Error(getUserResponseError.errorMessage);
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
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				alert(error.message);
				throw new Error(error.stack);
			}
		}
	};

	return (
		<div className="flex flex-col gap-y-8 animate__animated animate__slideInRight animate__faster">
			<nav className="flex items-center justify-between px-8 pt-4">
				<a href="/" className="text-lg text-white font-bold">
					BudgetPartner
				</a>

				<button type="button" className="btn px-0.5 py-0.5" onClick={(): void => navigate("/")}>
					<svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<title>Arrow Back</title>
						<path d="M9 14L5 10L9 6" stroke="#007AFF" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round" />
						<path
							d="M5 10H16C17.0609 10 18.0783 10.4214 18.8284 11.1716C19.5786 11.9217 20 12.9391 20 14C20 15.0609 19.5786 16.0783 18.8284 16.8284C18.0783 17.5786 17.0609 18 16 18H15"
							stroke="#007AFF"
							strokeWidth="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</button>
			</nav>

			<div className="flex flex-col gap-y-4 px-8">
				<div className="flex items-center justify-end">
					<button
						type="button"
						className="bg-[#007AFF] h-full px-2 py-1 rounded-lg"
						onClick={(): void => navigate("/new-extraincome")}
					>
						<span className="text-sm text-white font-bold">+ Add new</span>
					</button>
				</div>

				<div className="flex flex-col gap-y-6">
					<div className="flex items-center justify-between">
						<span className="text-base text-white font-semibold">Total Income</span>
						<span className="text-base text-white font-bold">
							{totalExtraincomes ? totalExtraincomes.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ") : "0 00"}
							{Utils.formatCurrencyFunction(budget.currency)}
						</span>
					</div>

					<div className="flex flex-col gap-y-4 h-[30rem] overflow-y-scroll">
						{extraincomesSortedByCreatedAtAscending.length > 0 &&
							extraincomesSortedByCreatedAtAscending.map((extraincome: IExtraincome) => (
								<button
									type="button"
									key={extraincome.id}
									className="flex flex-col btn px-0 py-0 w-full rounded-none"
									onClick={async (): Promise<void> => handleRemoveExtraincome(extraincome)}
								>
									<div className="flex items-center gap-x-2 w-full">
										<span className="text-sm text-[#66666F] font-normal">
											{new Date(extraincome.date).toDateString()}
										</span>

										<hr className="flex-grow bg-[#66666F] text-[#66666F] h-[0.5px] border-none" />
									</div>

									<div className="flex items-center justify-between w-full">
										<span className="text-base text-[#91919A] font-medium truncate">{extraincome.type}</span>
										<span className="text-base text-[#007AFF] font-medium truncate">
											+{extraincome.amount_monthly.toFixed(2)}
											{Utils.formatCurrencyFunction(budget.currency)}
										</span>
									</div>
								</button>
							))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default BudgetExtraincomes;
