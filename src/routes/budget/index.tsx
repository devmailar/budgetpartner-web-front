import React, { type ReactNode, useEffect, useState } from "react";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import ImageGrowth from "../../assets/growth.webp";
import Switch from "../../components/Switch";
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
		<div className="flex flex-col gap-y-12 animate__animated animate__slideInLeft animate__faster">
			<nav className="flex items-center justify-between px-8 pt-3">
				<a href="/" className="text-xl text-white font-bold">
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
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<path
									d="M9 10C9 10.7956 9.31607 11.5587 9.87868 12.1213C10.4413 12.6839 11.2044 13 12 13C12.7956 13 13.5587 12.6839 14.1213 12.1213C14.6839 11.5587 15 10.7956 15 10C15 9.20435 14.6839 8.44129 14.1213 7.87868C13.5587 7.31607 12.7956 7 12 7C11.2044 7 10.4413 7.31607 9.87868 7.87868C9.31607 8.44129 9 9.20435 9 10Z"
									stroke="#525252"
									strokeWidth="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<path
									d="M6.16803 18.849C6.41554 18.0252 6.922 17.3032 7.61228 16.79C8.30255 16.2768 9.13988 15.9997 10 16H14C14.8613 15.9997 15.6996 16.2774 16.3904 16.7918C17.0812 17.3062 17.5875 18.0298 17.834 18.855"
									stroke="#525252"
									strokeWidth="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
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
						<span className="text-xl text-[#66666F] font-bold">Login</span>
					</button>
				)}
			</nav>

			<div className="flex flex-col gap-y-6 px-8">
				<div className="flex items-center justify-end">
					{auth && (
						<div className="flex gap-x-2.5 items-center justify-center px-1.5 py-1 bg-[#18181B] rounded-full">
							<Switch />

							<button type="button" className="btn px-0.5 py-0.5" onClick={(): void => navigate("/settings")}>
								<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
									<title>Settings</title>
									<path
										d="M14.6271 6.11575C15.2306 3.62808 18.7694 3.62808 19.3729 6.11575C19.4635 6.48947 19.641 6.83652 19.891 7.12867C20.141 7.42081 20.4565 7.64979 20.8118 7.79697C21.167 7.94415 21.552 8.00537 21.9354 7.97565C22.3187 7.94592 22.6897 7.82609 23.018 7.62592C25.2039 6.29425 27.7072 8.79608 26.3755 10.9834C26.1756 11.3116 26.056 11.6823 26.0263 12.0654C25.9967 12.4485 26.0578 12.8333 26.2048 13.1883C26.3518 13.5433 26.5805 13.8587 26.8724 14.1087C27.1642 14.3587 27.5109 14.5363 27.8843 14.6271C30.3719 15.2306 30.3719 18.7694 27.8843 19.3729C27.5105 19.4635 27.1635 19.641 26.8713 19.891C26.5792 20.141 26.3502 20.4565 26.203 20.8118C26.0558 21.167 25.9946 21.552 26.0244 21.9354C26.0541 22.3187 26.1739 22.6897 26.3741 23.018C27.7058 25.2039 25.2039 27.7072 23.0166 26.3755C22.6884 26.1756 22.3177 26.056 21.9346 26.0263C21.5515 25.9967 21.1667 26.0578 20.8117 26.2048C20.4567 26.3518 20.1413 26.5805 19.8913 26.8724C19.6413 27.1642 19.4637 27.5109 19.3729 27.8843C18.7694 30.3719 15.2306 30.3719 14.6271 27.8843C14.5365 27.5105 14.359 27.1635 14.109 26.8713C13.859 26.5792 13.5435 26.3502 13.1882 26.203C12.833 26.0558 12.448 25.9946 12.0646 26.0244C11.6813 26.0541 11.3103 26.1739 10.982 26.3741C8.79608 27.7058 6.29283 25.2039 7.6245 23.0166C7.82439 22.6884 7.94403 22.3177 7.97369 21.9346C8.00334 21.5515 7.94218 21.1667 7.79517 20.8117C7.64816 20.4567 7.41945 20.1413 7.12764 19.8913C6.83582 19.6413 6.48913 19.4637 6.11575 19.3729C3.62808 18.7694 3.62808 15.2306 6.11575 14.6271C6.48947 14.5365 6.83652 14.359 7.12867 14.109C7.42081 13.859 7.64979 13.5435 7.79697 13.1882C7.94415 12.833 8.00537 12.448 7.97565 12.0646C7.94592 11.6813 7.82609 11.3103 7.62592 10.982C6.29425 8.79608 8.79608 6.29283 10.9834 7.6245C12.4001 8.48583 14.2361 7.72367 14.6271 6.11575Z"
										stroke="#525252"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M12.75 17C12.75 18.1272 13.1978 19.2082 13.9948 20.0052C14.7918 20.8022 15.8728 21.25 17 21.25C18.1272 21.25 19.2082 20.8022 20.0052 20.0052C20.8022 19.2082 21.25 18.1272 21.25 17C21.25 15.8728 20.8022 14.7918 20.0052 13.9948C19.2082 13.1978 18.1272 12.75 17 12.75C15.8728 12.75 14.7918 13.1978 13.9948 13.9948C13.1978 14.7918 12.75 15.8728 12.75 17Z"
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

				<div className="flex gap-x-2 items-center px-2 py-4 bg-[#18181B] rounded-2xl">
					<img src={ImageGrowth} alt="growth" width={60} height={60} loading="lazy" />

					<div className="flex flex-col gap-y-2">
						<h1 className="text-base font-bold text-[#895FF5]">
							We saved in{" "}
							{Object.keys(budget).length === 0
								? Utils.monthsList[new Date().getMonth()]
								: Utils.monthsList[new Date(budget.created_at).getMonth()]}
						</h1>

						<span className="text-2xl font-bold text-white">
							{monthlyBudget ? monthlyBudget.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ") : "0 00"}
							{Utils.formatCurrencyFunction(budget.currency)}
						</span>

						<p className="text-sm text-[#66666F] font-medium">#budgetingmakeslegends</p>
					</div>
				</div>

				<div className="flex gap-x-3 items-center justify-center">
					<button
						type="button"
						className="flex gap-x-1 items-center justify-center w-full btn px-2 py-1 bg-[#007AFF] rounded-lg"
						onClick={(): void => {
							navigate("/extraincomes");
						}}
					>
						<span className="text-sm text-white font-bold">View Income</span>

						<svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<title>Arrow Up</title>
							<g clipPath="url(#clip0_1_82)">
								<path d="M3.75 17L9.75 11L13.75 15L21.75 7" stroke="white" strokeWidth="2" />
								<path d="M14.75 7H21.75V14" stroke="white" strokeWidth="2" />
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
							navigate("/extraexpenses");
						}}
					>
						<svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<title>Arrow Down</title>
							<g clipPath="url(#clip0_1_87)">
								<path d="M3.75 7L9.75 13L13.75 9L21.75 17" stroke="#B85C3D" strokeWidth="2" />
								<path d="M14.75 17H21.75V10" stroke="#B85C3D" strokeWidth="2" />
							</g>
							<defs>
								<clipPath id="clip0_1_87">
									<rect width="24" height="24" fill="white" transform="matrix(1 0 0 -1 0.75 24)" />
								</clipPath>
							</defs>
						</svg>

						<span className="text-sm text-[#B85C3D] font-bold">View Expenses</span>
					</button>
				</div>

				<div className="flex flex-col gap-y-3">
					<p className="w-full text-sm text-[#66666F] font-normal">
						Your financial information is safe with us. BudgetPartner securely stores your data, allowing you to revisit
						your progress over time. It’s like having a personal financial assistant at your fingertips.
					</p>

					<div className="flex flex-wrap gap-x-2">
						<a className="text-sm text-[#323232] font-normal underline" href="/terms-of-service">
							Terms of Service
						</a>

						<a className="text-sm text-[#323232] font-normal underline" href="/privacy-policy">
							Privacy Policy
						</a>

						<a className="text-sm text-[#323232] font-normal underline" href="/contact-us">
							Contact Us
						</a>

						<a className="text-sm text-[#323232] font-normal underline" href="/cookie-notice">
							Cookie Notice
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Budget;
