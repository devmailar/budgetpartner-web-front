import type { Dispatch } from "@reduxjs/toolkit";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { setAuthStore } from "../../stores/auth";
import { setBudgetStore } from "../../stores/budget";
import { setBudgetsStore } from "../../stores/budgets";
import { setDialogStore } from "../../stores/dialog";
import { setUserStore } from "../../stores/user";
import type { IBudget, IResponseError, IRootState, IUserResponse } from "../../types";
import { Utils } from "../../utils";

function Tour(): React.ReactNode {
	const dispatch: Dispatch = useDispatch();
	const navigate: NavigateFunction = useNavigate();

	const authStore: string = useSelector((state: IRootState) => state.auth);

	const [disableSubmit, setDisableSubmit] = React.useState<boolean>(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		try {
			event.preventDefault();

			setDisableSubmit(true);

			const form: FormData = new FormData(event.currentTarget);
			const extraincome_amount_monthly: number = Number.parseFloat(form.get("extraincome_amount_monthly") as string);

			if (extraincome_amount_monthly < 1 || !extraincome_amount_monthly) {
				alert("Invalid income amount");

				setTimeout((): void => setDisableSubmit(false), 2500);

				return;
			}

			const createBudgetResponse: Response = await fetch(`${Utils.baseUrl}/budgets/create`, {
				method: "POST",
				headers: { Authorization: `Bearer ${authStore}`, "Content-Type": "application/json" },
				body: JSON.stringify({ date: new Date() }),
			});

			if (!createBudgetResponse.ok) {
				const createBudgetResponseError: IResponseError = await createBudgetResponse.json();

				throw new Error(createBudgetResponseError.message);
			}

			const getUserResponse: Response = await fetch(`${Utils.baseUrl}/users/get`, {
				method: "GET",
				headers: { Authorization: `Bearer ${authStore}` },
			});

			if (!getUserResponse.ok) {
				const getUserResponseError: IResponseError = await getUserResponse.json();

				throw new Error(getUserResponseError.message);
			}

			const getUserResponseBody: IUserResponse = await getUserResponse.json();

			const currentBudget: IBudget | undefined = getUserResponseBody.budgets.find((budget: IBudget): boolean => {
				return new Date(budget.created_at).getMonth() === new Date().getMonth();
			});

			if (!currentBudget) {
				throw new Error("No currentBudget");
			}

			const createExtraincomeResponse: Response = await fetch(`${Utils.baseUrl}/extraincomes/create`, {
				method: "POST",
				headers: { Authorization: `Bearer ${authStore}`, "Content-Type": "application/json" },
				body: JSON.stringify({
					budget_id: currentBudget.id,
					extraincome_type: "Salary",
					extraincome_amount_monthly: extraincome_amount_monthly,
					extraincome_includes_weekends: false,
					extraincome_date: new Date(),
				}),
			});

			if (!createExtraincomeResponse.ok) {
				const createExtraincomeResponseError: IResponseError = await createExtraincomeResponse.json();

				throw new Error(createExtraincomeResponseError.message);
			}

			const getUserResponseAgain: Response = await fetch(`${Utils.baseUrl}/users/get`, {
				method: "GET",
				headers: { Authorization: `Bearer ${authStore}` },
			});

			if (!getUserResponseAgain.ok) {
				const getUserResponseAgainError: IResponseError = await getUserResponseAgain.json();

				throw new Error(getUserResponseAgainError.message);
			}

			const getUserResponseAgainBody: IUserResponse = await getUserResponseAgain.json();

			if (Object.keys(getUserResponseAgainBody).length === 0) {
				throw new Error("User response again is empty");
			}

			dispatch(setUserStore(getUserResponseAgainBody.user));
			dispatch(setBudgetsStore(getUserResponseAgainBody.budgets));

			const currentBudgetAgain: IBudget | undefined = getUserResponseAgainBody.budgets.find(
				(budget: IBudget): boolean => {
					return new Date(budget.created_at).getMonth() === new Date().getMonth();
				},
			);

			dispatch(setBudgetStore(currentBudgetAgain));

			navigate("/");
		} catch (error: unknown) {
			if (error instanceof Error) {
				alert(error.message);

				setTimeout(() => setDisableSubmit(false), 2250);
			}
		}
	};

	return (
		<div className="h-screen animate__animated animate__slideInRight animate__faster">
			<nav className="flex items-center justify-between px-5 py-2.5 border-b border-b-[#313131]">
				<button
					type="button"
					onClick={(): void => {
						navigate("/login");
					}}
				>
					<span className="text-lg text-[#007AFF] font-medium">Back</span>
				</button>

				<h2 className="text-lg text-white font-medium">BudgetPartner</h2>

				<button
					type="button"
					onClick={(): void => {
						dispatch(setAuthStore(""));
						dispatch(setBudgetStore({}));
						dispatch(setBudgetsStore([]));
						dispatch(setUserStore({}));
						dispatch(setDialogStore({ extraincomes: false, extraexpenses: false }));

						navigate("/login");
					}}
				>
					<span className="text-lg text-[#007AFF] font-medium">Logout</span>
				</button>
			</nav>

			<form className="flex flex-col gap-7 items-center px-6 py-12" onSubmit={handleSubmit}>
				<img
					src="https://ucarecdn.com/6d80f052-288f-47ff-9ed7-f9fc3118bf70/-/preview/101x100/"
					alt="https://ucarecdn.com/6d80f052-288f-47ff-9ed7-f9fc3118bf70/-/preview/101x100/"
					width={101}
					height={100}
				/>

				<div className="flex flex-col items-center justify-center gap-y-3">
					<h1 className="text-2xl font-semibold text-white">
						{Utils.monthsList[new Date().getMonth()]} ({new Date().getFullYear()})
					</h1>

					<p className="text-sm font-normal text-[#66666F] text-center">Set your start eg. salary to start a budget.</p>
				</div>

				<div className="flex items-center gap-2 px-4 py-3 bg-[#18181B] border border-[#212121] rounded-lg">
					<svg width={24} height={25} fill="none" viewBox="0 0 24 25">
						<title>Euro</title>
						<g clipPath="url(#clip0_946_105)">
							<path
								stroke="#66666F"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M3 12.4253C3 13.6072 3.23279 14.7775 3.68508 15.8694C4.13738 16.9614 4.80031 17.9535 5.63604 18.7893C6.47177 19.625 7.46392 20.2879 8.55585 20.7402C9.64778 21.1925 10.8181 21.4253 12 21.4253C13.1819 21.4253 14.3522 21.1925 15.4442 20.7402C16.5361 20.2879 17.5282 19.625 18.364 18.7893C19.1997 17.9535 19.8626 16.9614 20.3149 15.8694C20.7672 14.7775 21 13.6072 21 12.4253C21 11.2434 20.7672 10.0731 20.3149 8.98114C19.8626 7.88921 19.1997 6.89706 18.364 6.06133C17.5282 5.2256 16.5361 4.56267 15.4442 4.11038C14.3522 3.65808 13.1819 3.42529 12 3.42529C10.8181 3.42529 9.64778 3.65808 8.55585 4.11038C7.46392 4.56267 6.47177 5.2256 5.63604 6.06133C4.80031 6.89706 4.13738 7.88921 3.68508 8.98114C3.23279 10.0731 3 11.2434 3 12.4253Z"
							/>
							<path
								stroke="#66666F"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M14.401 8.42529C13.732 7.79729 12.901 7.42529 12 7.42529C9.79 7.42529 8 9.66429 8 12.4253C8 15.1863 9.79 17.4253 12 17.4253C12.9 17.4253 13.731 17.0533 14.4 16.4253"
							/>
							<path stroke="#66666F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M7 10.9253H11" />
							<path stroke="#66666F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M7 13.9253H11" />
						</g>
						<defs>
							<clipPath id="clip0_946_105">
								<rect width={24} height={24} fill={"white"} transform="translate(0 0.425293)" />
							</clipPath>
						</defs>
					</svg>

					<input
						className="bg-transparent text-base font-normal text-white placeholder:text-[#66666F] w-72 outline-none"
						type="text"
						name="extraincome_amount_monthly"
						id="extraincome_amount_monthly"
						placeholder="0.00"
						required
					/>
				</div>

				<div className="flex items-center justify-center w-full px-5 py-5 border-y border-y-[#313131]">
					<button
						type="submit"
						className={`btn bg-[#007AFF] w-full px-2 py-3 rounded-lg ${disableSubmit ? "opacity-40" : "opacity-100"}`}
						disabled={disableSubmit}
					>
						<span className="text-base font-medium text-white">Finish</span>
					</button>
				</div>
			</form>
		</div>
	);
}

export default Tour;
