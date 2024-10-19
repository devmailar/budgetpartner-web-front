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
		<div className="flex flex-col gap-y-12 animate__animated animate__slideInRight animate__faster">
			<nav className="flex items-center justify-start px-8 pt-3">
				<button type="button" onClick={(): void => navigate("/")}>
					<span className="text-xl text-[#66666F] font-bold">Back</span>
				</button>
			</nav>

			<div className="flex flex-col gap-y-6 px-8">
				<div className="flex flex-col gap-y-1 items-center">
					<span className="font-lg text-[#66666F] font-bold">Currency</span>
					<select
						name="currencies"
						className="px-2.5 py-1.5 bg-[#212121] text-base text-[#525252] font-medium rounded-full"
						defaultValue={budgetStore.currency}
						onChange={async (e: ChangeEvent<HTMLSelectElement>) => {
							try {
								const changeCurrencyResponse: Response = await fetch(`${Utils.baseUrl}/budgets/change-currency`, {
									method: "POST",
									headers: { Authorization: `Bearer ${authStore}`, "Content-Type": "application/json" },
									body: JSON.stringify({ id: budgetStore.id, currency: e.target.value }),
								});

								if (!changeCurrencyResponse.ok) {
									const changeCurrencyResponseError: IResponseError = await changeCurrencyResponse.json();

									throw new Error(changeCurrencyResponseError.errorMessage);
								}
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
