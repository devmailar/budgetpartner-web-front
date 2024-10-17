import { eachDayOfInterval, endOfMonth, isWeekend, startOfMonth } from "date-fns";
import React, { type ReactNode, useEffect, useState } from "react";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import ImageGrowth from "../../assets/growth.webp";
import Navbar from "../../components/Navbar";
import Switch from "../../components/Switch";
import useAuthStore, { type IAuthState } from "../../stores/auth";
import useBudgetStore, { type IBudgetState } from "../../stores/budget";
import useBudgetsStore, { type IBudgetsState } from "../../stores/budgets";
import useUserStore, { type IUserState } from "../../stores/user";
import type { IBudget, IExtraexpense, IExtraincome, IResponseError, IUserResponse } from "../../types";
import { Utils } from "../../utils";

const Budget = (): ReactNode => {
	const navigate: NavigateFunction = useNavigate();

	const { value: auth, setAuthStore } = useAuthStore();
	const { value: budget, setBudgetStore } = useBudgetStore();
	const { setBudgetsStore } = useBudgetsStore();
	const { setUserStore } = useUserStore();

	const [dailyBudget, setDailyBudget] = useState<number>(0);
	const [monthlyBudget, setMonthlyBudget] = useState<number>(0);

	useEffect((): void => {
		try {
			if (!auth) {
				setBudgetStore({} as IBudgetState["value"]);
				setBudgetsStore([] as IBudgetsState["value"]);
				setUserStore({} as IUserState["value"]);
				return;
			}

			const handleGetUserResponse = async (): Promise<void> => {
				try {
					const getUserResponse: Response = await fetch(`${Utils.baseUrl}/users/get`, {
						method: "GET",
						headers: { Authorization: `Bearer ${auth}` },
					});

					if (!getUserResponse.ok) {
						const getUserResponseError: IResponseError = await getUserResponse.json();

						throw new Error(getUserResponseError.errorMessage);
					}

					const getUserResponseBody: IUserResponse = await getUserResponse.json();

					if (getUserResponseBody.errorNoData.user.is_new) {
						return navigate("/tour");
					}

					setUserStore(getUserResponseBody.errorNoData.user);
					setBudgetsStore(getUserResponseBody.errorNoData.budgets);

					const currentBudget: IBudget | undefined = getUserResponseBody.errorNoData.budgets.find(
						(budget: IBudget): boolean => new Date(budget.created_at).getMonth() === new Date().getMonth(),
					);

					if (!currentBudget) {
						const createBudgetResponse: Response = await fetch(`${Utils.baseUrl}/budgets/create`, {
							method: "POST",
							headers: { Authorization: `Bearer ${auth}`, "Content-Type": "application/json" },
							body: JSON.stringify({ date: new Date() }),
						});

						if (!createBudgetResponse.ok) {
							const createBudgetResponseError: IResponseError = await createBudgetResponse.json();

							throw new Error(createBudgetResponseError.errorMessage);
						}

						alert(`Happy ${Utils.monthsList[new Date().getMonth()]} 💙\n\nEnjoy your new budget!`);

						const getUserResponseAgain: Response = await fetch(`${Utils.baseUrl}/users/get`, {
							method: "GET",
							headers: { Authorization: `Bearer ${auth}` },
						});

						if (!getUserResponseAgain.ok) {
							const getUserResponseAgainError: IResponseError = await getUserResponseAgain.json();

							throw new Error(getUserResponseAgainError.errorMessage);
						}

						const getUserResponseBodyAgain: IUserResponse = await getUserResponseAgain.json();
						setUserStore(getUserResponseBodyAgain.errorNoData.user);
						setBudgetsStore(getUserResponseBodyAgain.errorNoData.budgets);

						const currentBudgetAgain: IBudget | undefined = getUserResponseBodyAgain.errorNoData.budgets.find(
							(budget: IBudget): boolean => {
								return new Date(budget.created_at).getMonth() === new Date().getMonth();
							},
						);

						if (!currentBudgetAgain) {
							return;
						}

						return setBudgetStore(currentBudgetAgain);
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
							return setBudgetStore(currentBudget);
						}

						setBudgetStore(matchingBudget);
					} else {
						setBudgetStore(currentBudget);
					}
				} catch (error: unknown) {
					if (error instanceof Error) {
						setAuthStore("" as IAuthState["value"]);
						setBudgetStore({} as IBudgetState["value"]);
						setBudgetsStore([] as IBudgetsState["value"]);
						setUserStore({} as IUserState["value"]);

						navigate("/login");

						alert(error.message);
						throw new Error(error.stack);
					}
				}
			};

			handleGetUserResponse();
		} catch (error: unknown) {
			if (error instanceof Error) {
				alert(error.message);
				throw new Error(error.stack);
			}
		}
	}, [auth, navigate, setAuthStore, setBudgetStore, setBudgetsStore, setUserStore]);

	useEffect((): void => {
		try {
			if (Object.keys(budget).length === 0) {
				return;
			}

			const totalExtraincomes: number = budget.extraincomes.reduce((accumulator: number, extraincome: IExtraincome) => {
				return accumulator + extraincome.amount_monthly;
			}, 0);

			if (Number.isNaN(totalExtraincomes)) {
				return;
			}

			const totalExtraexpenses: number = budget.extraexpenses.reduce(
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

			const includesWeekends: boolean = budget.extraincomes.some((extraincome: IExtraincome) => {
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
				throw new Error(error.stack);
			}
		}
	}, [budget]);

	return (
		<div className="flex flex-col gap-y-8 animate__animated animate__slideInLeft animate__faster">
			<Navbar />

			<div className="flex flex-col gap-y-8 px-8">
				<div className="flex items-center justify-end">
					{auth && (
						<div className="flex gap-x-2.5 items-center justify-center px-1.5 py-1 bg-[#18181B] rounded-full">
							<Switch />

							<button type="button" className="btn px-0.5 py-0.5" onClick={(): void => navigate("/settings")}>
								<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
									<title>Settings</title>
									<path
										d="M12.9062 5.39625C13.4387 3.20125 16.5613 3.20125 17.0938 5.39625C17.1736 5.726 17.3303 6.03222 17.5509 6.29C17.7715 6.54778 18.0499 6.74982 18.3633 6.87968C18.6768 7.00955 19.0165 7.06356 19.3547 7.03734C19.693 7.01111 20.0203 6.90538 20.31 6.72875C22.2387 5.55375 24.4475 7.76125 23.2725 9.69125C23.0961 9.98082 22.9906 10.3079 22.9644 10.646C22.9382 10.984 22.9922 11.3235 23.1219 11.6367C23.2516 11.95 23.4534 12.2282 23.7109 12.4488C23.9684 12.6694 24.2743 12.8261 24.6038 12.9062C26.7988 13.4387 26.7988 16.5613 24.6038 17.0938C24.274 17.1736 23.9678 17.3303 23.71 17.5509C23.4522 17.7715 23.2502 18.0499 23.1203 18.3633C22.9905 18.6768 22.9364 19.0165 22.9627 19.3547C22.9889 19.693 23.0946 20.0203 23.2713 20.31C24.4463 22.2387 22.2387 24.4475 20.3087 23.2725C20.0192 23.0961 19.6921 22.9906 19.354 22.9644C19.016 22.9382 18.6765 22.9922 18.3633 23.1219C18.05 23.2516 17.7718 23.4534 17.5512 23.7109C17.3306 23.9684 17.1739 24.2743 17.0938 24.6038C16.5613 26.7988 13.4387 26.7988 12.9062 24.6038C12.8264 24.274 12.6697 23.9678 12.4491 23.71C12.2285 23.4522 11.9501 23.2502 11.6367 23.1203C11.3232 22.9905 10.9835 22.9364 10.6453 22.9627C10.307 22.9889 9.97969 23.0946 9.69 23.2713C7.76125 24.4463 5.5525 22.2387 6.7275 20.3087C6.90388 20.0192 7.00944 19.6921 7.0356 19.354C7.06177 19.016 7.0078 18.6765 6.87809 18.3633C6.74838 18.05 6.54658 17.7718 6.28909 17.5512C6.03161 17.3306 5.7257 17.1739 5.39625 17.0938C3.20125 16.5613 3.20125 13.4387 5.39625 12.9062C5.726 12.8264 6.03222 12.6697 6.29 12.4491C6.54778 12.2285 6.74982 11.9501 6.87968 11.6367C7.00955 11.3232 7.06356 10.9835 7.03734 10.6453C7.01111 10.307 6.90538 9.97969 6.72875 9.69C5.55375 7.76125 7.76125 5.5525 9.69125 6.7275C10.9412 7.4875 12.5612 6.815 12.9062 5.39625Z"
										stroke="#525252"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M11.25 15C11.25 15.9946 11.6451 16.9484 12.3483 17.6517C13.0516 18.3549 14.0054 18.75 15 18.75C15.9946 18.75 16.9484 18.3549 17.6517 17.6517C18.3549 16.9484 18.75 15.9946 18.75 15C18.75 14.0054 18.3549 13.0516 17.6517 12.3483C16.9484 11.6451 15.9946 11.25 15 11.25C14.0054 11.25 13.0516 11.6451 12.3483 12.3483C11.6451 13.0516 11.25 14.0054 11.25 15Z"
										stroke="#525252"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</button>
						</div>
					)}
				</div>

				<div className="flex gap-2 items-center px-2 py-4 bg-[#18181B] rounded-2xl">
					<img src={ImageGrowth} alt="growth" width={60} height={60} loading="lazy" />

					<div className="flex flex-col gap-y-1.5">
						<h1 className="text-sm font-bold text-[#895FF5]">
							We saved in{" "}
							{Object.keys(budget).length === 0
								? Utils.monthsList[new Date().getMonth()]
								: Utils.monthsList[new Date(budget.created_at).getMonth()]}
						</h1>

						<span className="text-2xl font-bold text-white">
							{monthlyBudget ? monthlyBudget.toFixed(2) : "···"}
							{Utils.formatCurrencyFunction(budget.currency)}
						</span>

						<p className="text-sm text-[#66666F] font-medium underline">#financialfreedom</p>
					</div>
				</div>

				<div className="flex gap-x-3 items-center justify-center">
					<button
						type="button"
						className="flex gap-x-1 items-center justify-center w-full btn px-2 py-1 bg-[#007AFF] rounded-lg"
						onClick={(): void => {
							if (!auth) {
								navigate("/login");
								return;
							}

							navigate("/extraincomes");
						}}
					>
						<span className="text-xs text-white font-bold">View Income</span>

						<svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<title>Arrow Up</title>
							<g clip-path="url(#clip0_1_82)">
								<path d="M3.75 17L9.75 11L13.75 15L21.75 7" stroke="white" stroke-width="2" />
								<path d="M14.75 7H21.75V14" stroke="white" stroke-width="2" />
							</g>
							<defs>
								<clipPath id="clip0_1_82">
									<rect width="24" height="24" fill="white" transform="translate(0.75)" />
								</clipPath>
							</defs>
						</svg>
					</button>

					<button
						type="button"
						className="flex gap-x-1 items-center justify-center w-full btn px-2 py-1 border-[1.5px] border-[#B85C3D] rounded-lg"
						onClick={(): void => {
							if (!auth) {
								navigate("/login");
								return;
							}

							navigate("/extraexpenses");
						}}
					>
						<svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<title>Arrow Down</title>
							<g clip-path="url(#clip0_1_87)">
								<path d="M3.75 7L9.75 13L13.75 9L21.75 17" stroke="#B85C3D" stroke-width="2" />
								<path d="M14.75 17H21.75V10" stroke="#B85C3D" stroke-width="2" />
							</g>
							<defs>
								<clipPath id="clip0_1_87">
									<rect width="24" height="24" fill="white" transform="matrix(1 0 0 -1 0.75 24)" />
								</clipPath>
							</defs>
						</svg>

						<span className="text-xs text-[#B85C3D] font-bold">View Expenses</span>
					</button>
				</div>

				<div className="flex flex-col gap-y-3">
					<p className="w-full text-[10px] text-[#66666F] font-normal">
						Your financial information is safe with us. BudgetPartner securely stores your data, allowing you to revisit
						your progress over time. It’s like having a personal financial assistant at your fingertips.
					</p>

					<div className="flex gap-x-2">
						<a className="text-[10px] text-[#323232] font-normal underline" href="/terms-of-service">
							Terms of Service
						</a>

						<a className="text-[10px] text-[#323232] font-normal underline" href="/privacy-policy">
							Privacy Policy
						</a>

						<a className="text-[10px] text-[#323232] font-normal underline" href="/contact-us">
							Contact Us
						</a>

						<a className="text-[10px] text-[#323232] font-normal underline" href="/cookie-notice">
							Cookie Notice
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Budget;
