import type { Dispatch } from "@reduxjs/toolkit";
import { eachDayOfInterval, endOfMonth, isWeekend, startOfMonth } from "date-fns";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import "swiper/css";
import { setAuthStore } from "../../stores/auth";
import { setBudgetStore } from "../../stores/budget";
import { setBudgetsStore } from "../../stores/budgets";
import { setUserStore } from "../../stores/user";
import type { IBudget, IExtraexpense, IExtraincome, IResponseError, IRootState, IUserResponse } from "../../types";
import { Utils } from "../../utils";

function Budget(): React.ReactNode {
	const dispatch: Dispatch = useDispatch();
	const navigate: NavigateFunction = useNavigate();

	const authStore: string = useSelector((state: IRootState) => state.auth);
	const budgetStore: IBudget = useSelector((state: IRootState) => state.budget);

	const [dailyBudget, setDailyBudget] = React.useState<number>(0);
	const [monthlyBudget, setMonthlyBudget] = React.useState<number>(0);

	React.useEffect((): void => {
		try {
			const handleGetUserResponse = async (): Promise<void> => {
				try {
					const getUserResponse: Response = await fetch(`${Utils.baseUrl}/users/get`, {
						method: "GET",
						headers: { Authorization: `Bearer ${authStore}` },
					});

					if (!getUserResponse.ok) {
						const getUserResponseError: IResponseError = await getUserResponse.json();

						throw new Error(getUserResponseError.message);
					}

					const getUserResponseBody: IUserResponse = await getUserResponse.json();

					if (getUserResponseBody.user.is_new) {
						return navigate("/login");
					}

					dispatch(setUserStore(getUserResponseBody.user));
					dispatch(setBudgetsStore(getUserResponseBody.budgets));

					const currentBudget: IBudget | undefined = getUserResponseBody.budgets.find((budget: IBudget): boolean => {
						return new Date(budget.created_at).getMonth() === new Date().getMonth();
					});

					const storedBudgetDate: string = localStorage.getItem("budget") ?? "";
					alert("Welcome Back💙");

					if (storedBudgetDate) {
						const matchingBudget: IBudget | undefined = getUserResponseBody.budgets.find((budget: IBudget): boolean => {
							const budgetDate: Date = new Date(budget.created_at);
							const match: boolean = budgetDate.toISOString() === storedBudgetDate;

							return match;
						});

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
						// dispatch(setAuthStore(""));
						// dispatch(setBudgetStore({}));

						alert(error.message);
					}
				}
			};

			// if (!authStore) {
			// 	console.log("🚀 ~ React.useEffect ~ authStore:", authStore);
			// 	dispatch(setBudgetStore({}));
			// 	navigate("/login");

			// 	return;
			// }

			handleGetUserResponse();
		} catch (error: unknown) {
			if (error instanceof Error) {
				alert(error.message);
			}
		}
	}, [authStore, navigate, dispatch]);

	React.useEffect((): void => {
		try {
			if (Object.keys(budgetStore).length === 0) {
				return;
			}

			const totalExtraincomes: number = budgetStore.extraincomes.reduce(
				(accumulator: number, extraincome: IExtraincome) => {
					return accumulator + extraincome.extraincome_amount_monthly;
				},
				0,
			);

			if (Number.isNaN(totalExtraincomes)) {
				return;
			}

			const totalExtraexpenses: number = budgetStore.extraexpenses.reduce(
				(accumulator: number, extraexpense: IExtraexpense) => {
					return accumulator + extraexpense.extraexpense_amount_monthly;
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
				return extraincome.extraincome_includes_weekends;
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
		<div className="h-screen animate__animated animate__slideInLeft animate__faster">
			<nav className="flex items-center justify-between px-5 py-2.5 border-b border-b-[#313131]">
				<h2 className="text-lg text-white font-medium">BudgetPartner</h2>

				{authStore ? (
					<button
						type="button"
						onClick={(): void => {
							dispatch(setAuthStore(""));
							dispatch(setBudgetStore({}));
							dispatch(setBudgetsStore([]));
							dispatch(setUserStore({}));

							setDailyBudget(0);
							setMonthlyBudget(0);

							navigate("/login");
						}}
					>
						<span className="text-lg text-[#007AFF] font-medium">Logout</span>
					</button>
				) : (
					<button
						type="button"
						onClick={(): void => {
							navigate("/login");
						}}
					>
						<span className="text-lg text-[#007AFF] font-medium">Login</span>
					</button>
				)}
			</nav>

			<div className="flex flex-col gap-y-[18px] px-6 py-12">
				<div className="flex flex-col gap-1 px-[18px] py-[18px] bg-[#18181B] border border-[#212121] rounded-2xl">
					<div className="flex items-center justify-between">
						<div className="flex flex-col gap-1">
							<p className="font-base font-semibold text-[#007AFF]">
								We saved in{" "}
								{Object.keys(budgetStore).length === 0
									? Utils.monthsList[new Date().getMonth()]
									: Utils.monthsList[new Date(budgetStore.created_at).getMonth()]}
							</p>

							<p className="text-[32px] font-bold text-white">{monthlyBudget ? monthlyBudget.toFixed(2) : "···"}€</p>
						</div>

						<button
							type="button"
							className="flex items-center gap-1 px-3 py-2 border-[1.5px] border-[#3F3F46] rounded-2xl"
						>
							<span className="text-lg text-[#66666F] font-normal">
								{Object.keys(budgetStore).length === 0
									? Utils.monthsList[new Date().getMonth()]
									: Utils.monthsList[new Date(budgetStore.created_at).getMonth()]}
							</span>

							<svg width={20} height={22} fill="none" viewBox="0 0 20 22">
								<title>ArrowDown</title>
								<path
									stroke="#66666F"
									strokeWidth="1.5"
									d="M10 19.75C14.6024 19.75 18.3334 15.8325 18.3334 11C18.3334 6.16751 14.6024 2.25 10 2.25C5.39765 2.25 1.66669 6.16751 1.66669 11C1.66669 15.8325 5.39765 19.75 10 19.75Z"
								/>
								<path
									stroke="#66666F"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M13.3334 9.6875C13.3334 9.6875 10.8784 12.3125 10 12.3125C9.1216 12.3125 6.66669 9.6875 6.66669 9.6875"
								/>
							</svg>
						</button>
					</div>

					<span className="text-base text-[#66666F] font-medium">#budgetingmakeslegends</span>
				</div>

				<div className="flex gap-6 items-center px-[18px] py-[18px] bg-[#18181B] border border-[#212121] rounded-2xl">
					<img
						src="https://ucarecdn.com/d8300ff5-fe6e-4e8c-a79d-db94212a2ab5/-/preview/77x77/"
						alt="https://ucarecdn.com/d8300ff5-fe6e-4e8c-a79d-db94212a2ab5/-/preview/77x77/"
						width={77}
						height={77}
					/>

					<div className="flex flex-col gap-1">
						<p className="font-base font-semibold text-[#007AFF]">We saved Today</p>
						<p className="text-[28px] font-bold text-white"> {dailyBudget ? dailyBudget.toFixed(2) : "···"}€</p>
						<p className="text-base text-[#66666F] font-medium">#financialfreedom</p>
					</div>
				</div>

				<div className="flex items-center justify-center gap-3 py-6 border-t border-t-[#313131]">
					<button
						type="button"
						className="flex items-center justify-center gap-1 btn bg-[#007AFF] px-2 py-3 rounded-lg"
					>
						<span className="text-base text-white font-medium">View Income</span>

						<svg width={29} height={28} fill="none" viewBox="0 0 29 28">
							<title>Arrow Up</title>
							<g clipPath="url(#clip0_838_2559)">
								<path stroke="white" strokeWidth="2" d="M4.25 19.8333L11.25 12.8333L15.9167 17.5L25.25 8.16663" />
								<path stroke="white" strokeWidth="2" d="M17.0833 8.16663H25.25V16.3333" />
							</g>
							<defs>
								<clipPath id="clip0_838_2559">
									<rect width={28} height={28} fill="white" transform="translate(0.75)" />
								</clipPath>
							</defs>
						</svg>
					</button>

					<button
						type="button"
						className="flex items-center justify-center gap-1 btn bg-transparent px-2 py-3 rounded-lg border-[1.5px] border-[#B85C3D]"
					>
						<svg width={29} height={28} fill="none" viewBox="0 0 29 28">
							<title>Arrow Down</title>
							<g clipPath="url(#clip0_838_2565)">
								<path stroke="white" strokeWidth="2" d="M3.75 8.16671L10.75 15.1667L15.4167 10.5L24.75 19.8334" />
								<path stroke="white" strokeWidth="2" d="M16.5833 19.8334H24.75V11.6667" />
							</g>
							<defs>
								<clipPath id="clip0_838_2559">
									<rect width={28} height={28} fill="white" transform="matrix(1 0 0 -1 0.25 28)" />
								</clipPath>
							</defs>
						</svg>
						<span className="text-base text-white font-medium">View Expenses</span>
					</button>
				</div>

				<div className="flex flex-col items-center justify-center gap-3 px-4 py-4 border-t border-t-[#313131]">
					<h2 className="text-base text-[#66666F] font-semibold">Privacy</h2>

					<p className="text-sm text-[#66666F] text-center font-normal">
						Your financial information is safe with us. Budget Partner securely stores your data, allowing you to
						revisit your progress over time. It’s like having a personal financial assistant at your fingertips.
					</p>
				</div>
			</div>
		</div>
	);
}

export default Budget;
