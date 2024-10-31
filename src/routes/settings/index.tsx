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
		<div className="flex justify-center">
			<div className="flex flex-col gap-y-12 w-full w-full md:w-[40rem] animate__animated animate__slideInRight animate__faster">
				<nav className="flex items-center justify-start px-6 md:px-0 py-3 border-b-[0.33px] border-b-[#454545]">
					<button type="button" className="btn" onClick={(): void => navigate("/")}>
						<span className="text-xl text-[#66666F] font-bold font-rubik">Back</span>
					</button>
				</nav>

				<div className="flex flex-col gap-y-6 px-6 md:px-0">
					<span className="font-lg text-[#66666F] font-bold">Currency</span>
					<select
						name="currencies"
						className="flex items-center gap-x-1 w-40 px-1.5 py-1.5 bg-[#4400DE] text-xs text-white font-medium font-hanson rounded-md"
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

									throw new Error(changeCurrencyResponseError.message);
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
