import React, { type ChangeEvent, type ReactNode } from "react";
import { useSelector } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import type { IBudget, IResponseError, IRootState } from "../../types";
import { Utils } from "../../utils";

const Settings = (): ReactNode => {
	const navigate: NavigateFunction = useNavigate();

	const authStore: string = useSelector((state: IRootState) => state.auth);
	const budgetStore: IBudget = useSelector((state: IRootState) => state.budget);

	return (
		<div className="h-screen animate__animated animate__slideInRight animate__faster">
			<div className="flex flex-col gap-y-6 items-center justify-center">
				<h2 className="text-2xl font-semibold text-white">Settings</h2>

				<div className="flex flex-col gap-y-1 items-center">
					<span className="font-base font-semibold text-[#007AFF]">Currency</span>
					<select
						name="currencies"
						className="px-2.5 py-1.5 bg-transparent border-[1.5px] border-[#3F3F46] rounded-2xl text-lg text-[#66666F] font-normal"
						defaultValue={budgetStore.currency}
						onChange={async (e: ChangeEvent<HTMLSelectElement>) => {
							try {
								// update {budgetStore.id} currency column in table budgets

								const changeCurrencyResponse: Response = await fetch(`${Utils.baseUrl}/budgets/change-currency`, {
									method: "POST",
									headers: { Authorization: `Bearer ${authStore}`, "Content-Type": "application/json" },
									body: JSON.stringify({ id: budgetStore.id, currency: e.target.value }),
								});

								if (!changeCurrencyResponse.ok) {
									const changeCurrencyResponseError: IResponseError = await changeCurrencyResponse.json();

									throw new Error(changeCurrencyResponseError.errorMessage);
								}

								// fetch the user again and set budgetStore state
							} catch (error: unknown) {
								if (error instanceof Error) {
									alert(error.message);
								}
							}
						}}
					>
						<option value="EUR">EUR</option>
						<option value="USD">USD</option>
						<option value="INR">INR</option>
						<option value="BDT">BDT</option>
					</select>
				</div>
			</div>
		</div>
	);
};

export default Settings;
