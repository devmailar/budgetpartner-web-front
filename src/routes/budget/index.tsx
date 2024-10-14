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
		<div className="animate__animated animate__slideInLeft animate__faster">
			<nav className="flex items-center justify-between px-5 py-2.5 border-b border-b-[#313131]">
				<a href="/" className="text-lg text-white font-medium">
					BudgetPartner
				</a>

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

			<div className="flex flex-col gap-y-[18px] px-6 py-6">
				<div className="flex items-center justify-end">
					{authStore && (
						<button type="button" onClick={(): void => navigate("/settings")}>
							<svg width="39" height="38" viewBox="0 0 39 38" fill="none" xmlns="http://www.w3.org/2000/svg">
								<title>Settings</title>
								<path
									d="M16.8479 6.83525C17.5224 4.05492 21.4776 4.05492 22.1521 6.83525C22.2533 7.25293 22.4517 7.64082 22.7311 7.96733C23.0106 8.29385 23.3632 8.54977 23.7602 8.71426C24.1572 8.87876 24.5875 8.94718 25.016 8.91396C25.4445 8.88074 25.8591 8.74681 26.226 8.52308C28.6691 7.03475 31.4668 9.83092 29.9785 12.2756C29.7551 12.6424 29.6214 13.0567 29.5882 13.4849C29.5551 13.9131 29.6234 14.3431 29.7878 14.7399C29.9521 15.1367 30.2077 15.4891 30.5338 15.7685C30.86 16.0479 31.2474 16.2464 31.6648 16.3479C34.4451 17.0224 34.4451 20.9776 31.6648 21.6521C31.2471 21.7533 30.8592 21.9517 30.5327 22.2311C30.2062 22.5106 29.9502 22.8632 29.7857 23.2602C29.6212 23.6572 29.5528 24.0875 29.586 24.516C29.6193 24.9445 29.7532 25.3591 29.9769 25.726C31.4653 28.1691 28.6691 30.9668 26.2244 29.4785C25.8576 29.2551 25.4433 29.1214 25.0151 29.0882C24.5869 29.0551 24.1569 29.1234 23.7601 29.2878C23.3633 29.4521 23.0109 29.7077 22.7315 30.0338C22.4521 30.36 22.2536 30.7474 22.1521 31.1648C21.4776 33.9451 17.5224 33.9451 16.8479 31.1648C16.7467 30.7471 16.5483 30.3592 16.2689 30.0327C15.9894 29.7062 15.6368 29.4502 15.2398 29.2857C14.8428 29.1212 14.4125 29.0528 13.984 29.086C13.5555 29.1193 13.1409 29.2532 12.774 29.4769C10.3309 30.9653 7.53317 28.1691 9.0215 25.7244C9.24491 25.3576 9.37862 24.9433 9.41177 24.5151C9.44491 24.0869 9.37655 23.6569 9.21225 23.2601C9.04794 22.8633 8.79233 22.5109 8.46618 22.2315C8.14004 21.9521 7.75256 21.7536 7.33525 21.6521C4.55492 20.9776 4.55492 17.0224 7.33525 16.3479C7.75293 16.2467 8.14082 16.0483 8.46733 15.7689C8.79385 15.4894 9.04977 15.1368 9.21426 14.7398C9.37876 14.3428 9.44718 13.9125 9.41396 13.484C9.38074 13.0555 9.24681 12.6409 9.02308 12.274C7.53475 9.83092 10.3309 7.03317 12.7756 8.5215C14.3589 9.48417 16.4109 8.63233 16.8479 6.83525Z"
									stroke="#007AFF"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<path
									d="M14.75 19C14.75 20.2598 15.2504 21.468 16.1412 22.3588C17.032 23.2496 18.2402 23.75 19.5 23.75C20.7598 23.75 21.968 23.2496 22.8588 22.3588C23.7496 21.468 24.25 20.2598 24.25 19C24.25 17.7402 23.7496 16.532 22.8588 15.6412C21.968 14.7504 20.7598 14.25 19.5 14.25C18.2402 14.25 17.032 14.7504 16.1412 15.6412C15.2504 16.532 14.75 17.7402 14.75 19Z"
									stroke="#007AFF"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</button>
					)}
				</div>

				<div className="flex flex-col gap-1 px-[18px] py-[18px] bg-[#18181B] border border-[#212121] rounded-2xl">
					<div className="flex items-center justify-between">
						<div className="flex flex-col gap-1">
							<h1 className="font-base font-semibold text-[#007AFF]">
								We saved in{" "}
								{Object.keys(budgetStore).length === 0
									? Utils.monthsList[new Date().getMonth()]
									: Utils.monthsList[new Date(budgetStore.created_at).getMonth()]}
							</h1>

							<span className="text-[32px] font-bold text-white">
								{monthlyBudget ? monthlyBudget.toFixed(2) : "···"}
								{Utils.formatCurrencyFunction(budgetStore.currency)}
							</span>
						</div>

						{authStore && <Switch />}
					</div>

					<p className="text-base text-[#66666F] font-medium">#budgetingmakeslegends</p>
				</div>

				<div className="flex gap-6 items-center px-[18px] py-[18px] bg-[#18181B] border border-[#212121] rounded-2xl">
					<img src={ImageGrowth} alt="growth" width={77} height={77} loading="lazy" />

					<div className="flex flex-col gap-1">
						<h1 className="font-base font-semibold text-[#007AFF]">We saved today</h1>

						<span className="text-[28px] font-bold text-white">
							{" "}
							{dailyBudget ? dailyBudget.toFixed(2) : "···"}
							{Utils.formatCurrencyFunction(budgetStore.currency)}
						</span>

						<p className="text-base text-[#66666F] font-medium">#financialfreedom</p>
					</div>
				</div>

				<div className="flex items-center justify-center gap-3 pt-4 pb-4">
					<button
						type="button"
						className="flex items-center justify-center gap-1 btn bg-[#007AFF] px-2 py-3 rounded-lg"
						onClick={(): void => {
							if (!authStore) {
								navigate("/login");
								return;
							}

							navigate("/extraincomes");
						}}
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
						onClick={(): void => {
							if (!authStore) {
								navigate("/login");
								return;
							}

							navigate("/extraexpenses");
						}}
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
						Your financial information is safe with us. BudgetPartner securely stores your data, allowing you to revisit
						your progress over time. It’s like having a personal financial assistant at your fingertips.
					</p>

					<a className="text-sm text-[#66666F] text-center font-normal underline" href="/terms-of-service">
						Terms of Service
					</a>

					<a className="text-sm text-[#66666F] text-center font-normal underline" href="/privacy-policy">
						Privacy Policy
					</a>

					<a className="text-sm text-[#66666F] text-center font-normal underline" href="/contact-us">
						Contact Us
					</a>

					<a className="text-sm text-[#66666F] text-center font-normal underline" href="/cookie-notice">
						Cookie Notice
					</a>
				</div>
			</div>
		</div>
	);
};

export default Budget;
