import React, { type ChangeEvent, type ReactNode } from "react";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import useAuthStore, { type IAuthState } from "../../stores/auth";
import useBudgetStore, { type IBudgetState } from "../../stores/budget";
import type { IResponseError } from "../../types";
import { Utils } from "../../utils";

const Settings = (): ReactNode => {
	const navigate: NavigateFunction = useNavigate();

	const authStore: IAuthState["value"] = useAuthStore.getState().value;
	const budgetStore: IBudgetState["value"] = useBudgetStore.getState().value;

	return (
		<div className="h-screen animate__animated animate__slideInRight animate__faster">
			<nav className="flex items-center justify-between px-5 py-2.5 border-b border-b-[#313131]">
				<h2 className="text-lg text-white font-medium">BudgetPartner</h2>

				<button type="button" onClick={(): void => navigate("/")}>
					<span className="text-lg text-[#007AFF] font-medium">Back</span>
				</button>
			</nav>

			<div className="flex flex-col gap-y-6 items-center justify-center px-6 py-6">
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

									throw new Error(changeCurrencyResponseError.message);
								}

								// fetch the user again and set budgetStore state
							} catch (error: unknown) {
								if (error instanceof Error) {
									alert(error.message);
									throw new Error(error.stack);
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
