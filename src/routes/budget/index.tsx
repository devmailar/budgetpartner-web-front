import type { Dispatch } from "@reduxjs/toolkit/react";
import { eachDayOfInterval, endOfMonth, isWeekend, startOfMonth } from "date-fns";
import React, { type ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import ImageGrowth from "../../assets/growth.webp";
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
		<div className="flex items-start justify-center p-16 animate__animated animate__faster">
			<div className="flex flex-col gap-y-8 w-[27.25rem]">
				<nav className="flex items-center justify-between p-4 border-[0.33px] border-[#ADADAD6E] shadow-sm rounded-[1.75rem]">
					<a
						href="/"
						className="text-lg text-[#262626] font-bold"
						style={{
							letterSpacing: -0.43,
						}}
					>
						BudgetPartner
					</a>

					<div className="flex gap-x-2 items-center">
						<button type="button" onClick={(): void => navigate("/settings")}>
							<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
								<title>Settings</title>
								<path
									d="M12.0458 5.0365C12.5428 2.98783 15.4572 2.98783 15.9542 5.0365C16.0287 5.34427 16.1749 5.63008 16.3808 5.87067C16.5867 6.11126 16.8465 6.29983 17.1391 6.42104C17.4317 6.54224 17.7487 6.59266 18.0644 6.56818C18.3801 6.5437 18.6856 6.44502 18.956 6.28017C20.7562 5.1835 22.8177 7.24383 21.721 9.04517C21.5564 9.31543 21.4579 9.62073 21.4334 9.93624C21.409 10.2517 21.4594 10.5686 21.5804 10.8609C21.7015 11.1533 21.8899 11.413 22.1302 11.6189C22.3705 11.8248 22.656 11.9711 22.9635 12.0458C25.0122 12.5428 25.0122 15.4572 22.9635 15.9542C22.6557 16.0287 22.3699 16.1749 22.1293 16.3808C21.8887 16.5867 21.7002 16.8465 21.579 17.1391C21.4578 17.4317 21.4073 17.7487 21.4318 18.0644C21.4563 18.3801 21.555 18.6856 21.7198 18.956C22.8165 20.7562 20.7562 22.8177 18.9548 21.721C18.6846 21.5564 18.3793 21.4579 18.0638 21.4334C17.7483 21.409 17.4314 21.4594 17.1391 21.5804C16.8467 21.7015 16.587 21.8899 16.3811 22.1302C16.1752 22.3705 16.0289 22.656 15.9542 22.9635C15.4572 25.0122 12.5428 25.0122 12.0458 22.9635C11.9713 22.6557 11.8251 22.3699 11.6192 22.1293C11.4133 21.8887 11.1535 21.7002 10.8609 21.579C10.5683 21.4578 10.2513 21.4073 9.93558 21.4318C9.61986 21.4563 9.31438 21.555 9.044 21.7198C7.24383 22.8165 5.18233 20.7562 6.279 18.9548C6.44362 18.6846 6.54214 18.3793 6.56656 18.0638C6.59099 17.7483 6.54062 17.4314 6.41955 17.1391C6.29848 16.8467 6.11014 16.587 5.86982 16.3811C5.6295 16.1752 5.34399 16.0289 5.0365 15.9542C2.98783 15.4572 2.98783 12.5428 5.0365 12.0458C5.34427 11.9713 5.63008 11.8251 5.87067 11.6192C6.11126 11.4133 6.29983 11.1535 6.42104 10.8609C6.54224 10.5683 6.59266 10.2513 6.56818 9.93558C6.5437 9.61986 6.44502 9.31438 6.28017 9.044C5.1835 7.24383 7.24383 5.18233 9.04517 6.279C10.2118 6.98833 11.7238 6.36067 12.0458 5.0365Z"
									stroke="#262626"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<path
									d="M10.5 14C10.5 14.9283 10.8687 15.8185 11.5251 16.4749C12.1815 17.1313 13.0717 17.5 14 17.5C14.9283 17.5 15.8185 17.1313 16.4749 16.4749C17.1313 15.8185 17.5 14.9283 17.5 14C17.5 13.0717 17.1313 12.1815 16.4749 11.5251C15.8185 10.8687 14.9283 10.5 14 10.5C13.0717 10.5 12.1815 10.8687 11.5251 11.5251C10.8687 12.1815 10.5 13.0717 10.5 14Z"
									stroke="#262626"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</button>

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
								<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
									<title>Logout</title>
									<path
										d="M17.5 9.33317V6.99984C17.5 6.381 17.2542 5.78751 16.8166 5.34992C16.379 4.91234 15.7855 4.6665 15.1667 4.6665H7C6.38116 4.6665 5.78767 4.91234 5.35009 5.34992C4.9125 5.78751 4.66667 6.381 4.66667 6.99984V20.9998C4.66667 21.6187 4.9125 22.2122 5.35009 22.6498C5.78767 23.0873 6.38116 23.3332 7 23.3332H15.1667C15.7855 23.3332 16.379 23.0873 16.8166 22.6498C17.2542 22.2122 17.5 21.6187 17.5 20.9998V18.6665"
										stroke="#262626"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M24.5 14H9.33333L12.8333 10.5"
										stroke="#262626"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M12.8335 17.5L9.3335 14"
										stroke="#262626"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</button>
						) : (
							<button
								type="button"
								onClick={(): void => {
									navigate("/login");
								}}
							>
								<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
									<title>Login</title>
									<path
										d="M10.5 9.33317V6.99984C10.5 6.381 10.7458 5.78751 11.1834 5.34992C11.621 4.91234 12.2145 4.6665 12.8333 4.6665H21C21.6188 4.6665 22.2123 4.91234 22.6499 5.34992C23.0875 5.78751 23.3333 6.381 23.3333 6.99984V20.9998C23.3333 21.6187 23.0875 22.2122 22.6499 22.6498C22.2123 23.0873 21.6188 23.3332 21 23.3332H12.8333C12.2145 23.3332 11.621 23.0873 11.1834 22.6498C10.7458 22.2122 10.5 21.6187 10.5 20.9998V18.6665"
										stroke="#262626"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M3.5 14H18.6667L15.1667 10.5"
										stroke="#262626"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M15.1665 17.5L18.6665 14"
										stroke="#262626"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</button>
						)}
					</div>
				</nav>

				<div className="flex items-center justify-center">
					<div className="bg-[#FEF8E5] px-3 py-2 border border-white rounded-lg">
						<span className="text-lg text-[#262626] font-bold">
							Don't wanna signup? Try our{" "}
							<a className="underline font-normal" href="#Demo">
								Demo
							</a>
						</span>
					</div>
				</div>

				<div className="flex flex-col gap-y-6">
					<div className="flex flex-col gap-y-4 items-center justify-center p-4 border-[0.33px] border-[#ADADAD6E] shadow-sm rounded-2xl">
						{authStore && <Switch />}

						<div className="flex flex-col gap-y-1.5 items-center justify-center">
							<span className="text-base text-[#262626] font-medium">We saved this month</span>

							<span className="text-[1.75rem] text-[#262626] font-bold">
								{monthlyBudget ? monthlyBudget.toFixed(2) : "···"}
								{Utils.formatCurrencyFunction(budgetStore.currency)}
							</span>

							<p className="text-base text-[#262626] font-extrabold italic">#budgetingmakeslegends</p>
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
					<h2 className="text-xs text-[#262626] font-bold">Privacy</h2>

					<p className="text-xs text-[#262626] font-normal">
						Your financial information is safe with us. BudgetPartner securely stores your data, allowing you to revisit
						your progress over time. It’s like having a personal financial assistant at your fingertips.
					</p>
				</div>
			</div>
		</div>
	);
};

export default Budget;
