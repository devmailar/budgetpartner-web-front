import type { Dispatch } from "@reduxjs/toolkit";
import React from "react";
import { useDispatch } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { getCookie } from "typescript-cookie";
import { setError } from "../../stores/Error";
import { setForceLogin } from "../../stores/ForceLogin";
import type { IBudget, IResponseError, IUserResponse } from "../../types";
import { Utils } from "../../utils";

function BudgetNew(): React.ReactNode {
	const dispatch: Dispatch = useDispatch();
	const navigate: NavigateFunction = useNavigate();

	const [selectMonth, setSelectMonth] = React.useState<boolean>(false);
	const [selectedMonth, setSelectedMonth] = React.useState<string>(Utils.months[new Date().getMonth()]);
	const [selectedYear] = React.useState<number>(new Date().getFullYear());

	const handleCreateIncome = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		try {
			event.preventDefault();

			const form: FormData = new FormData(event.currentTarget);
			const income: number = Number.parseInt(form.get("income") as string);

			const auth: string = getCookie("Authorization") ?? "";
			if (!auth) {
				dispatch(setForceLogin(true));
				return;
			}

			const year: number = selectedYear;
			const month: string = selectedMonth;
			const monthIndex: number = Utils.months.indexOf(month);
			const date: Date = new Date(year, monthIndex, 2);

			const createBudgetResponse: Response = await fetch(`${Utils.baseurl}/budgets/create`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${auth}`,
					"Content-Type": "application/json",
					"ngrok-skip-browser-warning": "69420",
				},
				body: JSON.stringify({ date: new Date(date) }),
			});

			if (!createBudgetResponse.ok) {
				const createBudgetResponseError: IResponseError = await createBudgetResponse.json();

				throw new Error(createBudgetResponseError.message);
			}

			const getUserResponse: Response = await fetch(`${Utils.baseurl}/users/get`, {
				method: "GET",
				headers: { Authorization: `Bearer ${auth}`, "ngrok-skip-browser-warning": "69420" },
			});

			if (!getUserResponse.ok) {
				const getUserResponseError: IResponseError = await getUserResponse.json();

				throw new Error(getUserResponseError.message);
			}

			const getUserResponseBody: IUserResponse = await getUserResponse.json();

			if (Object.keys(getUserResponseBody).length === 0) {
				throw new Error("User response is empty");
			}

			if (getUserResponseBody.budgets.length === 0) {
				throw new Error("Budgets response is empty");
			}

			const currentBudget: IBudget | undefined = getUserResponseBody.budgets.find((budget: IBudget): boolean => {
				return new Date(budget.created_at).getMonth() === new Date(date).getMonth();
			});

			if (!currentBudget) {
				throw new Error("Current budget is undefined");
			}

			if (Number.isNaN(income) || income <= 0) {
				throw new Error("Please enter valid amount");
			}

			if (income > 0) {
				const createExtraincomeResponse: Response = await fetch(`${Utils.baseurl}/extraincomes/create`, {
					method: "POST",
					headers: {
						Authorization: `Bearer ${auth}`,
						"Content-Type": "application/json",
						"ngrok-skip-browser-warning": "69420",
					},
					body: JSON.stringify({
						budget_id: currentBudget.id,
						extraincome_type: "Salary",
						extraincome_amount_monthly: income,
					}),
				});

				if (!createExtraincomeResponse.ok) {
					const createExtraincomeResponseError: IResponseError = await createExtraincomeResponse.json();

					throw new Error(createExtraincomeResponseError.message);
				}

				navigate("/");
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				dispatch(setError(error.message));
			}
		}
	};

	const handleSetSelectedMonth = (month: string): void => {
		try {
			setSelectMonth(false);
			setSelectedMonth(month);
		} catch (error) {
			if (error instanceof Error) {
				dispatch(setError(error.message));
			}
		}
	};

	const handleClose = (): void => {
		try {
			navigate("/");
		} catch (error) {
			if (error instanceof Error) {
				dispatch(setError(error.message));
			}
		}
	};

	React.useEffect((): void => {
		const auth: string = getCookie("Authorization") ?? "";
		if (!auth) return;
	}, []);

	return (
		<div className="flex items-center justify-center bg-radial-gradient w-screen h-screen">
			<div className="flex flex-col gap-y-6 justify-center w-[25rem]">
				<form className="flex flex-col gap-y-6 px-6 py-6 bg-dark rounded-lg" onSubmit={handleCreateIncome}>
					<div>
						<h1 className="text-2xl text-white font-medium font-rubik">New budget</h1>
						<p className="text-sm text-white font-normal font-rubik">Fill few sections to start a budget.</p>
					</div>

					<div className="flex flex-col gap-y-3">
						<div className="flex flex-col gap-y-1.5">
							<label className="text-sm text-white font-normal font-rubik">Budget month and year</label>

							<div className="flex gap-x-3 items-cente">
								<button
									type="button"
									className="flex items-center justify-between gap-x-2 h-10 px-3 border border-grey rounded-lg"
									onClick={(): void => setSelectMonth(!selectMonth)}
								>
									<span className="text-sm text-white font-normal font-rubik">{selectedMonth}</span>
									<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none">
										<title>Switch</title>
										<path
											d="M2.59827 11.9998C2.59827 16.9857 6.80647 21.0256 12.0001 21.0256C17.1937 21.0256 21.4019 16.9857 21.4019 11.9998C21.4019 7.014 17.1937 2.97412 12.0001 2.97412C6.80647 2.97412 2.59827 7.014 2.59827 11.9998ZM15.6659 10.1166C16.0049 9.79112 16.5608 9.79112 16.8998 10.1166C17.0716 10.2815 17.1529 10.4941 17.1529 10.7067C17.1529 10.9193 17.0671 11.1363 16.8953 11.3012L12.6329 15.3801C12.2893 15.6796 11.7605 15.6708 11.4305 15.3541L7.1048 11.2144C6.76579 10.889 6.76127 10.3596 7.1048 10.0298C7.4438 9.70439 7.99525 9.70003 8.33878 10.0298L12.0046 13.5837L15.6659 10.1166Z"
											fill="#895FF5"
										/>
									</svg>
								</button>

								<button
									type="button"
									className="flex items-center justify-between gap-x-1.5 h-10 px-3 border border-grey rounded-lg"
								>
									<span className="text-sm text-white font-normal font-rubik">{selectedYear}</span>
								</button>
							</div>
						</div>

						{selectMonth && (
							<menu className="absolute z-50 mt-[4.6rem] px-4 py-2.5 bg-darker border border-grey rounded-lg">
								{Utils.months.map((month: string) => (
									<button
										type="button"
										key={month}
										className="flex items-center py-1 w-full rounded-sm"
										onClick={(): void => handleSetSelectedMonth(month)}
									>
										<span className="text-base text-white font-normal font-rubik">{month}</span>
									</button>
								))}
							</menu>
						)}
					</div>

					<div className="flex flex-col gap-y-1.5">
						<label className="text-sm text-white font-normal font-rubik">
							Base income for {selectedMonth} - {selectedYear}
						</label>

						<div className="flex gap-x-4 items-center justify-between p-2 border-[1px] border-grey rounded-lg">
							<input
								className="bg-transparent w-full text-sm text-white placeholder:text-white font-normal font-rubik focus:outline-none"
								type="number"
								name="income"
								id="income"
								placeholder="0.00"
								required
							/>

							<span className="text-xs text-white font-normal font-rubik">EUR/MONTH</span>
						</div>
					</div>

					<div className="flex flex-col gap-y-4">
						<button type="submit" className="btn bg-purple py-2 rounded-lg">
							<span className="text-sm text-white font-medium font-rubik">Save</span>
						</button>

						<button type="button" className="btn bg-darker py-2 rounded-lg" onClick={(): void => handleClose()}>
							<span className="text-sm text-white font-medium font-rubik">Cancel</span>
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default BudgetNew;
