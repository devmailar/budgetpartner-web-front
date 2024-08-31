import type { Dispatch } from "@reduxjs/toolkit";
import "animate.css";
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
						return navigate("login");
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
						dispatch(setAuthStore(""));
						dispatch(setBudgetStore({}));

						alert(error.message);
					}
				}
			};

			if (!authStore) {
				dispatch(setBudgetStore({}));
				navigate("login");

				return;
			}

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
		<div className="bg-black h-screen">
			{/* <div className="flex flex-col gap-y-4 items-center">
				<div className="flex flex-col gap-y-2 items-center">
					<BudgetSwitch />

					<Swiper
						className="w-[20rem] md:w-[30rem] h-fit z-0"
						modules={[Autoplay]}
						autoplay={{ delay: 10000, disableOnInteraction: false }}
					>
						<SwiperSlide>
							<div className="flex flex-col gap-y-2 items-center py-8">
								<span className="text-base text-PurpleLight font-medium font-rubik">
									<FormattedMessage id="HOME_SWIPER_SPAN_TEXT2" />
								</span>

								<button
									type="button"
									onClick={(): void => {
										dispatch(
											setModals({
												extraincome: false,
												extraexpense: false,
												language: false,
												settings: false,
											}),
										);
									}}
								>
									<h1 className="animate__animated animate__fadeInUp text-4xl text-White font-bold font-rubik">
										{dailyBudgetAmount.toFixed(2)}€
									</h1>
								</button>
							</div>
						</SwiperSlide>

						<SwiperSlide>
							<div className="flex flex-col gap-y-1 items-center py-8">
								<span className="text-base text-PurpleLight font-medium font-rubik">
									<FormattedMessage id="HOME_SWIPER_SPAN_TEXT1" />{" "}
									{Utils.months[new Date(budget.created_at).getMonth()]}
								</span>

								<button
									type="button"
									onClick={(): void => {
										dispatch(
											setModals({
												extraincome: false,
												extraexpense: false,
												language: false,
												settings: false,
											}),
										);
									}}
								>
									<h1 className="animate__animated animate__fadeInUp text-4xl text-White font-bold font-rubik">
										{monthlyBudgetAmount.toFixed(2)}€
									</h1>
								</button>
							</div>
						</SwiperSlide>
					</Swiper>
				</div>

				<div className="flex flex-col gap-y-3 items-center">
					{auth && monthlyBudgetAmount === 0 && (
						<span className="text-center text-sm text-White font-normal font-rubik">⬇️ Please add your income ⬇️</span>
					)}

					<button
						type="button"
						className="flex gap-x-2 items-center justify-center btn bg-Purple px-6 py-3 rounded-3xl"
						onClick={(): void => {
							dispatch(
								setModals({
									extraincome: true,
									extraexpense: false,
									language: false,
									settings: false,
								}),
							);
						}}
					>
						<svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<title>Trending Up</title>
							<g clip-path="url(#clip0_624_21)">
								<path d="M3.5 17L9.5 11L13.5 15L21.5 7" stroke="#160C1F" stroke-width="2" />
								<path d="M14.5 7H21.5V14" stroke="#160C1F" stroke-width="2" />
							</g>
							<defs>
								<clipPath id="clip0_624_21">
									<rect width="24" height="24" fill="white" transform="translate(0.5)" />
								</clipPath>
							</defs>
						</svg>

						<span className="text-base text-PurpleDark font-medium font-rubik">Income</span>
					</button>

					<button
						type="button"
						className="flex gap-x-2 items-center justify-center btn bg-Orange px-6 py-3 rounded-3xl"
						onClick={(): void => {
							dispatch(
								setModals({
									extraincome: false,
									extraexpense: true,
									language: false,
									settings: false,
								}),
							);
						}}
					>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<title>Trending Down</title>
							<g clip-path="url(#clip0_624_27)">
								<path
									d="M3 7L9 13L13 9L21 17"
									stroke="#160C1F"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<path
									d="M21 10V17H14"
									stroke="#160C1F"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</g>
							<defs>
								<clipPath id="clip0_624_27">
									<rect width="24" height="24" fill="white" />
								</clipPath>
							</defs>
						</svg>

						<span className="text-base text-PurpleDark font-medium font-rubik">Expenses</span>
					</button>
				</div>
			</div> */}
		</div>
	);
}

export default Budget;
