import type { Dispatch } from "@reduxjs/toolkit/react";
import { eachDayOfInterval, endOfMonth, isWeekend, startOfMonth } from "date-fns";
import React, { type ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import Switch from "../../components/Switch";
import { setAuthStore } from "../../stores/auth";
import { setBudgetStore } from "../../stores/budget";
import { setBudgetsStore } from "../../stores/budgets";
import { setUserStore } from "../../stores/user";
import type { IBudget, IExtraexpense, IExtraincome, IResponseError, IRootState, IUserResponse } from "../../types";
import { Utils } from "../../utils";

const Budget = (): ReactNode => {
	const dispatch: Dispatch = useDispatch();
	const navigate: NavigateFunction = useNavigate();

	const authStore: string = useSelector((state: IRootState) => state.auth);
	const budgetStore: IBudget = useSelector((state: IRootState) => state.budget);

	const [dailyBudget, setDailyBudget] = useState<number>(0);
	const [monthlyBudget, setMonthlyBudget] = useState<number>(0);

	useEffect((): void => {
		try {
			const handleGetUserResponse = async (): Promise<void> => {
				try {
					const getUserResponse: Response = await fetch(`${Utils.baseUrl}/users/get`, {
						method: "GET",
						headers: { Authorization: `Bearer ${authStore}` },
					});

					if (!getUserResponse.ok) {
						const getUserResponseError: IResponseError = await getUserResponse.json();

						throw new Error(getUserResponseError.errorMessage);
					}

					const getUserResponseBody: IUserResponse = await getUserResponse.json();

					if (getUserResponseBody.errorNoData.user.is_new) {
						return navigate("/tour");
					}

					dispatch(setUserStore(getUserResponseBody.errorNoData.user));
					dispatch(setBudgetsStore(getUserResponseBody.errorNoData.budgets));

					const currentBudget: IBudget | undefined = getUserResponseBody.errorNoData.budgets.find(
						(budget: IBudget): boolean => {
							return new Date(budget.created_at).getMonth() === new Date().getMonth();
						},
					);

					if (!currentBudget) {
						const createBudgetResponse: Response = await fetch(`${Utils.baseUrl}/budgets/create`, {
							method: "POST",
							headers: { Authorization: `Bearer ${authStore}`, "Content-Type": "application/json" },
							body: JSON.stringify({ date: new Date() }),
						});

						if (!createBudgetResponse.ok) {
							const createBudgetResponseError: IResponseError = await createBudgetResponse.json();

							throw new Error(createBudgetResponseError.errorMessage);
						}

						alert(`Happy ${Utils.monthsList[new Date().getMonth()]} 💙\n\nEnjoy your new budget!`);

						const getUserResponseAgain: Response = await fetch(`${Utils.baseUrl}/users/get`, {
							method: "GET",
							headers: { Authorization: `Bearer ${authStore}` },
						});

						if (!getUserResponseAgain.ok) {
							const getUserResponseAgainError: IResponseError = await getUserResponseAgain.json();

							throw new Error(getUserResponseAgainError.errorMessage);
						}

						const getUserResponseBodyAgain: IUserResponse = await getUserResponseAgain.json();

						dispatch(setUserStore(getUserResponseBodyAgain.errorNoData.user));
						dispatch(setBudgetsStore(getUserResponseBodyAgain.errorNoData.budgets));

						const currentBudgetAgain: IBudget | undefined = getUserResponseBodyAgain.errorNoData.budgets.find(
							(budget: IBudget): boolean => {
								return new Date(budget.created_at).getMonth() === new Date().getMonth();
							},
						);

						dispatch(setBudgetStore(currentBudgetAgain));

						return;
					}

					const storedBudgetDate: string = localStorage.getItem("budget") ?? "";
					// alert("Welcome Back💙");
					setTimeout((): void => {
						if (!getUserResponseBody.errorNoData.user.is_email_verified) {
							alert(
								`We have sent a verification email to ${getUserResponseBody.errorNoData.user.email}. Please check your inbox or spam folder for the message and click the link to complete the verification process.\n\nBest regards,\nsupport@budgetpartner.app`,
							);
						}
					}, 1500);

					if (storedBudgetDate) {
						const matchingBudget: IBudget | undefined = getUserResponseBody.errorNoData.budgets.find(
							(budget: IBudget): boolean => {
								const budgetDate: Date = new Date(budget.created_at);
								const match: boolean = budgetDate.toISOString() === storedBudgetDate;

								return match;
							},
						);

						if (!matchingBudget) {
							dispatch(setBudgetStore(currentBudget));
							return;
						}

						dispatch(setBudgetStore(matchingBudget));
					} else {
						dispatch(setBudgetStore(currentBudget));
					}
				} catch (error: unknown) {
					if (error instanceof Error) {
						dispatch(setAuthStore(""));
						dispatch(setBudgetStore({}));
						dispatch(setBudgetsStore([]));
						dispatch(setUserStore({}));

						navigate("/login");

						alert(error.message);
					}
				}
			};

			if (!authStore) {
				dispatch(setBudgetStore({}));
				dispatch(setBudgetsStore([]));
				dispatch(setUserStore({}));
				return;
			}

			handleGetUserResponse();
		} catch (error: unknown) {
			if (error instanceof Error) {
				alert(error.message);
			}
		}
	}, [authStore, navigate, dispatch]);

	useEffect((): void => {
		try {
			if (Object.keys(budgetStore).length === 0) {
				return;
			}

			const totalExtraincomes: number = budgetStore.extraincomes.reduce(
				(accumulator: number, extraincome: IExtraincome) => {
					return accumulator + extraincome.amount_monthly;
				},
				0,
			);

			if (Number.isNaN(totalExtraincomes)) {
				return;
			}

			const totalExtraexpenses: number = budgetStore.extraexpenses.reduce(
				(accumulator: number, extraexpense: IExtraexpense) => {
					return accumulator + extraexpense.amount_monthly;
				},
				0,
			);

			if (Number.isNaN(totalExtraexpenses)) {
				return;
			}

			const currentDaysInMonth: Date[] = eachDayOfInterval({
				start: startOfMonth(new Date()),
				end: endOfMonth(new Date()),
			});

			const includesWeekends: boolean = budgetStore.extraincomes.some((extraincome: IExtraincome) => {
				return extraincome.includes_weekends;
			});

			const daysInMonth: Date[] = includesWeekends
				? currentDaysInMonth
				: currentDaysInMonth.filter((day: Date) => {
						return !isWeekend(day);
					});

			const weekdaysInMonth: Date[] = daysInMonth.filter((day: Date) => {
				return !isWeekend(day);
			});

			const dailyBudgetAmount: number = includesWeekends
				? (totalExtraincomes - totalExtraexpenses) / daysInMonth.length
				: (totalExtraincomes - totalExtraexpenses) / weekdaysInMonth.length;

			const monthlyBudgetAmount: number = totalExtraincomes - totalExtraexpenses;

			setDailyBudget(dailyBudgetAmount);
			setMonthlyBudget(monthlyBudgetAmount);
		} catch (error: unknown) {
			if (error instanceof Error) {
				alert(error.message);
			}
		}
	}, [budgetStore]);

	return (
		<div className="flex flex-col gap-y-8 h-screen animate__animated animate__slideInLeft animate__faster">
			{!authStore && (
				<div className="flex items-center justify-center">
					<div className="bg-[#1E1804] px-3 py-2 rounded-lg">
						<span className="text-lg text-[#FF9500] font-bold">
							Don't wanna signup? Try our{" "}
							<a className="underline font-normal" href="#Demo">
								Demo
							</a>
						</span>
					</div>
				</div>
			)}

			<div className="flex flex-col gap-y-6">
				<div className="flex flex-col gap-y-4 items-center justify-center p-4 bg-[#18181b] border border-[#212121] rounded-2xl">
					<div className="flex flex-col gap-y-1.5 items-center justify-center">
						<span className="text-base text-[#007AFF] font-bold">We saved this month</span>

						<span className="text-[1.75rem] text-white font-bold">
							{monthlyBudget ? monthlyBudget.toFixed(2) : "···"}
							{Utils.formatCurrencyFunction(budgetStore.currency)}
						</span>

						<p className="text-base text-[#66666F] font-extrabold italic">#budgetingmakeslegends</p>
					</div>
				</div>

				<div className="flex gap-x-3 items-center justify-center h-8">
					<button
						type="button"
						className="flex gap-x-1 items-center justify-center btn bg-[#007AFF] px-2 py-1 w-full h-full shadow-md rounded-lg"
						onClick={(): void => {
							if (!authStore) {
								navigate("/login");
								return;
							}

							navigate("/extraincomes");
						}}
					>
						<span className="text-sm text-white font-bold">View Income</span>

						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<title>Arrow Up</title>
							<g clip-path="url(#clip0_1136_42)">
								<path d="M3 17L9 11L13 15L21 7" stroke="white" stroke-width="2" />
								<path d="M14 7H21V14" stroke="white" stroke-width="2" />
							</g>
							<defs>
								<clipPath id="clip0_1136_42">
									<rect width="24" height="24" fill="white" />
								</clipPath>
							</defs>
						</svg>
					</button>

					<button
						type="button"
						className="flex gap-x-1 items-center justify-center btn border-[1.5px] border-[#B85C3D] px-2 py-1 w-full h-full shadow-md rounded-lg"
						onClick={(): void => {
							if (!authStore) {
								navigate("/login");
								return;
							}

							navigate("/extraexpenses");
						}}
					>
						<svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<title>Arrow Down</title>
							<g clip-path="url(#clip0_1136_47)">
								<path d="M3.5 7L9.5 13L13.5 9L21.5 17" stroke="#B85C3D" stroke-width="2" />
								<path d="M14.5 17H21.5V10" stroke="#B85C3D" stroke-width="2" />
							</g>
							<defs>
								<clipPath id="clip0_1136_47">
									<rect width="24" height="24" fill="white" transform="matrix(1 0 0 -1 0.5 24)" />
								</clipPath>
							</defs>
						</svg>

						<span className="text-sm text-[#B85C3D] font-bold">View Expenses</span>
					</button>
				</div>
			</div>

			<div className="flex flex-col gap-y-3 justify-center py-4 border-t border-t-[#262626]">
				<h2 className="text-xs text-[#66666F] font-bold">Privacy</h2>

				<p className="text-xs text-[#66666F] font-normal">
					Your financial information is safe with us. BudgetPartner securely stores your data, allowing you to revisit
					your progress over time. It’s like having a personal financial assistant at your fingertips.
				</p>
			</div>
		</div>
	);
};

export default Budget;
