import React, { type ReactNode } from "react";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { db } from "../../db";
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
				if (!auth) {
					await db.extraincomes.delete(extraincome.id);

					navigate("/");

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
		<div className="flex flex-col gap-y-12 animate__animated animate__slideInRight animate__faster">
			<nav className="flex items-center justify-between px-8 py-3 border-b-[0.33px] border-b-[#454545]">
				<button type="button" onClick={(): void => navigate("/")}>
					<span className="text-xl text-[#66666F] font-bold">Back</span>
				</button>

				<button type="button" onClick={(): void => navigate("/new-extraincome")}>
					<span className="text-xl text-white font-bold">+ Add new</span>
				</button>
			</nav>

			<div className="flex flex-col gap-y-6 px-8">
				<div className="flex items-center justify-between">
					<h2 className="text-xl text-white font-bold">Total Income</h2>
					<span className="text-xl text-white font-bold">
						{totalExtraincomes ? totalExtraincomes.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ") : "0 00"}
						{Utils.formatCurrencyFunction(budget.currency)}
					</span>
				</div>

				<div className="flex flex-col gap-y-4 h-[30rem] overflow-y-scroll">
					{extraincomesSortedByCreatedAtAscending.length > 0 ? (
						extraincomesSortedByCreatedAtAscending.map((extraincome: IExtraincome) => (
							<button
								type="button"
								key={extraincome.id}
								className="flex flex-col gap-y-2 btn px-0 py-0 w-full rounded-none"
								onClick={async (): Promise<void> => handleRemoveExtraincome(extraincome)}
							>
								<div className="flex items-center gap-x-2 w-full">
									<span className="text-sm text-[#66666F] font-bold">{new Date(extraincome.date).toDateString()}</span>
									<hr className="flex-grow bg-[#66666F] h-[0.5px] border-none" />
								</div>
								<div className="flex items-center justify-between w-full">
									<span className="text-base text-[#91919A] font-bold truncate">{extraincome.type}</span>
									<span className="text-base text-[#009951] font-bold truncate">
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
								to add new income
							</p>
						</div>
					)}
				</div>

				<div className="flex flex-col gap-y-3">
					<p className="w-full text-sm text-[#66666F] font-normal">
						Your financial information is safe with us. BudgetPartner securely stores your data, allowing you to revisit
						your progress over time. It’s like having a personal financial assistant at your fingertips.
					</p>

					<div className="flex flex-wrap gap-x-2">
						<a className="text-sm text-[#323232] font-normal underline" href="/terms-of-service">
							Terms of Service
						</a>

						<a className="text-sm text-[#323232] font-normal underline" href="/privacy-policy">
							Privacy Policy
						</a>

						<a className="text-sm text-[#323232] font-normal underline" href="/contact-us">
							Contact Us
						</a>

						<a className="text-sm text-[#323232] font-normal underline" href="/cookie-notice">
							Cookie Notice
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BudgetExtraincomes;
