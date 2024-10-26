import React, { type ReactNode, useEffect, useState } from "react";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import ImageCopyright from "../../assets/copyright.webp";
import ImagePattern from "../../assets/pattern.webp";
import ImageTrustpilot from "../../assets/trustpilot.webp";
import Extraexpenses from "../../components/Extraexpenses";
import Extraincomes from "../../components/Extraincomes";
import { db } from "../../db";
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

	const [monthlyBudget, setMonthlyBudget] = useState<number>(0);
	const [selectedTab, setSelectedTab] = useState<"incomes" | "expenses">((): "incomes" | "expenses" => {
		const storedValue: string | null = localStorage.getItem("selectedTab");
		return storedValue === "expenses" ? "expenses" : "incomes";
	});

	useEffect((): void => {
		try {
			const handleGetDemoBudget = async (): Promise<void> => {
				try {
					const budgets: IBudget[] = await db.budgets.toArray();
					if (budgets.length === 0) {
						await db.budgets.add({
							id: 1,
							user_id: 1,
							currency: "EUR",
							extraincomes: [],
							extraexpenses: [],
							created_at: new Date(),
							updated_at: new Date(),
						});

						return;
					}

					setBudgetStore(budgets[0]);

					const extraincomes: IExtraincome[] = await db.extraincomes.toArray();
					const extraexpenses: IExtraexpense[] = await db.extraexpenses.toArray();

					setBudgetStore({
						id: budgets[0].id,
						user_id: budgets[0].user_id,
						currency: budgets[0].currency,
						extraincomes: extraincomes,
						extraexpenses: extraexpenses,
						created_at: budgets[0].created_at,
						updated_at: budgets[0].updated_at,
					});

					return;
				} catch (error: unknown) {
					if (error instanceof Error) {
						alert(error.message);
						throw new Error(error.stack);
					}
				}
			};

			if (!auth) {
				setBudgetStore({} as IBudgetState["value"]);
				setBudgetsStore([] as IBudgetsState["value"]);
				setUserStore({} as IUserState["value"]);

				handleGetDemoBudget();
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

						throw new Error(getUserResponseError.message);
					}

					const getUserResponseBody: IUserResponse = await getUserResponse.json();

					if (getUserResponseBody.user.is_new) {
						return navigate("/tour");
					}

					setUserStore(getUserResponseBody.user);
					setBudgetsStore(getUserResponseBody.budgets);

					const currentBudget: IBudget | undefined = getUserResponseBody.budgets.find(
						(budget: IBudget): boolean => new Date(budget.created_at).getMonth() === new Date().getMonth(),
					);

					if (!currentBudget) {
						const createBudgetResponse: Response = await fetch(`${Utils.baseUrl}/budgets/create`, {
							method: "POST",
							headers: {
								Authorization: `Bearer ${auth}`,
								"Content-Type": "application/json",
							},
							body: JSON.stringify({ date: new Date() }),
						});

						if (!createBudgetResponse.ok) {
							const createBudgetResponseError: IResponseError = await createBudgetResponse.json();

							throw new Error(createBudgetResponseError.message);
						}

						alert(`Happy ${Utils.monthsList[new Date().getMonth()]} 💙\n\nEnjoy your new budget!`);

						const getUserResponseAgain: Response = await fetch(`${Utils.baseUrl}/users/get`, {
							method: "GET",
							headers: { Authorization: `Bearer ${auth}` },
						});

						if (!getUserResponseAgain.ok) {
							const getUserResponseAgainError: IResponseError = await getUserResponseAgain.json();

							throw new Error(getUserResponseAgainError.message);
						}

						const getUserResponseBodyAgain: IUserResponse = await getUserResponseAgain.json();
						setUserStore(getUserResponseBodyAgain.user);
						setBudgetsStore(getUserResponseBodyAgain.budgets);

						const currentBudgetAgain: IBudget | undefined = getUserResponseBodyAgain.budgets.find(
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
						if (!getUserResponseBody.user.is_email_verified) {
							alert(
								`We have sent a verification email to ${getUserResponseBody.user.email}. Please check your inbox or spam folder for the message and click the link to complete the verification process.\n\nBest regards,\nsupport@budgetpartner.app`,
							);
						}
					}, 1500);

					if (storedBudgetDate) {
						const matchingBudget: IBudget | undefined = getUserResponseBody.budgets.find((budget: IBudget): boolean => {
							const budgetDate: Date = new Date(budget.created_at);
							const match: boolean = budgetDate.toISOString() === storedBudgetDate;

							return match;
						});

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

			const monthlyBudgetAmount: number = totalExtraincomes - totalExtraexpenses;
			setMonthlyBudget(monthlyBudgetAmount);
		} catch (error: unknown) {
			if (error instanceof Error) {
				alert(error.message);
				throw new Error(error.stack);
			}
		}
	}, [budget]);

	return (
		<div className="flex flex-col gap-y-16 animate__animated animate__slideInLeft animate__faster">
			<nav className="flex items-center justify-between px-8 py-3 border-b-[0.33px] border-b-[#454545]">
				<a href="/" className="text-xl text-white font-bold font-rubik">
					BudgetPartner
				</a>

				{auth ? (
					<button type="button" className="btn px-0.5 py-0.5" onClick={(): void => navigate("/profile")}>
						<svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<title>Profile</title>
							<g clipPath="url(#clip0_1_122)">
								<path
									d="M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 10.8181 20.7672 9.64778 20.3149 8.55585C19.8626 7.46392 19.1997 6.47177 18.364 5.63604C17.5282 4.80031 16.5361 4.13738 15.4442 3.68508C14.3522 3.23279 13.1819 3 12 3C10.8181 3 9.64778 3.23279 8.55585 3.68508C7.46392 4.13738 6.47177 4.80031 5.63604 5.63604C4.80031 6.47177 4.13738 7.46392 3.68508 8.55585C3.23279 9.64778 3 10.8181 3 12Z"
									stroke="#525252"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M9 10C9 10.7956 9.31607 11.5587 9.87868 12.1213C10.4413 12.6839 11.2044 13 12 13C12.7956 13 13.5587 12.6839 14.1213 12.1213C14.6839 11.5587 15 10.7956 15 10C15 9.20435 14.6839 8.44129 14.1213 7.87868C13.5587 7.31607 12.7956 7 12 7C11.2044 7 10.4413 7.31607 9.87868 7.87868C9.31607 8.44129 9 9.20435 9 10Z"
									stroke="white"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M6.16803 18.849C6.41554 18.0252 6.922 17.3032 7.61228 16.79C8.30255 16.2768 9.13988 15.9997 10 16H14C14.8613 15.9997 15.6996 16.2774 16.3904 16.7918C17.0812 17.3062 17.5875 18.0298 17.834 18.855"
									stroke="white"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</g>
							<defs>
								<clipPath id="clip0_1_122">
									<rect width="24" height="24" fill="white" />
								</clipPath>
							</defs>
						</svg>
					</button>
				) : (
					<button type="button" onClick={(): void => navigate("/login")}>
						<span className="text-xl text-white font-bold font-rubik">Login</span>
					</button>
				)}
			</nav>

			<div className="flex flex-col gap-y-8 px-6 relative">
				<img className="absolute -top-14 right-0 -z-10" src={ImagePattern} alt="pattern" />

				<div className="flex items-center justify-between">
					<div className="flex flex-col gap-y-3">
						<h2 className="text-base text-[#878787] font-normal font-rubik">Budget Balance</h2>

						<div className="flex items-end">
							<span className="text-[1.75rem] text-white font-bold font-hanson">
								{Utils.formatCurrencyFunction(budget.currency)}
							</span>
							<span className="text-[2.5rem] text-white font-bold font-hanson">{monthlyBudget.toFixed(0)}</span>
							<span className="text-[1.75rem] text-white font-bold font-hanson">
								.{monthlyBudget.toFixed(2).split(".")[1]}
							</span>
						</div>

						<div className="flex gap-x-2 items-center">
							<span className="text-sm text-white font-bold font-hanson">NET M/M</span>
							<span className="text-sm text-[#56AB4D] font-bold font-hanson">N/A%</span>
						</div>
					</div>

					<button type="button" className="px-3 py-3 bg-white border-4 border-[#EDEDED] rounded-full">
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
							<title>Add</title>
							<path
								d="M10 4.16667V15.8333"
								stroke="black"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M4.16669 10H15.8334"
								stroke="black"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</button>
				</div>

				<div className="flex flex-col gap-y-6">
					<div className="flex gap-x-4 items-center px-0.5 py-0.5 bg-[#171717] rounded-full">
						<button
							type="button"
							className={`flex items-center justify-center w-full btn px-2 py-1 ${selectedTab === "incomes" ? "bg-[#4400DE]" : "bg-transparent"} rounded-full`}
							onClick={(): void => {
								setSelectedTab("incomes");
								localStorage.setItem("selectedTab", "incomes");
							}}
						>
							<span className="h-[17px] text-sm text-white font-extrabold font-rubik">View Income</span>
							<svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<title>Arrow Up</title>
								<path d="M3.75 17L9.75 11L13.75 15L21.75 7" stroke="white" stroke-width="2" />
								<path d="M14.75 7H21.75V14" stroke="white" stroke-width="2" />
							</svg>
						</button>

						<button
							type="button"
							className={`flex items-center justify-center w-full btn px-2 py-1 ${selectedTab === "expenses" ? "bg-[#4400DE]" : "bg-transparent"} rounded-full`}
							onClick={(): void => {
								setSelectedTab("expenses");
								localStorage.setItem("selectedTab", "expenses");
							}}
						>
							<span className="h-[17px] 	text-sm text-white font-extrabold font-rubik">View Expenses</span>
							<svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<title>Arrow Down</title>
								<path d="M3.25 7L9.25 13L13.25 9L21.25 17" stroke="white" stroke-width="2" />
								<path d="M14.25 17H21.25V10" stroke="white" stroke-width="2" />
							</svg>
						</button>
					</div>

					{Object.keys(budget).length > 0 && (selectedTab === "incomes" ? <Extraincomes /> : <Extraexpenses />)}
				</div>

				<div className="flex flex-col gap-y-3">
					<p className="w-full text-sm text-[#66666F] font-normal font-rubik">
						Your financial information is safe with us. BudgetPartner securely stores your data, allowing you to revisit
						your progress over time. It’s like having a personal financial assistant at your fingertips.
					</p>

					<div className="flex flex-wrap gap-x-2">
						<a className="text-sm text-[#323232] font-medium font-rubik underline" href="/terms-of-service">
							Terms of Service
						</a>

						<a className="text-sm text-[#323232] font-medium font-rubik underline" href="/privacy-policy">
							Privacy Policy
						</a>

						<a className="text-sm text-[#323232] font-medium font-rubik underline" href="/contact-us">
							Contact Us
						</a>

						<a className="text-sm text-[#323232] font-medium font-rubik underline" href="/cookie-notice">
							Cookie Notice
						</a>
					</div>
				</div>

				<div className="flex gap-x-6 items-center">
					<img src={ImageTrustpilot} alt="trustpilot" width={75} />
					<img src={ImageCopyright} alt="copyright" width={15} />
				</div>
			</div>
		</div>
	);
};

export default Budget;
