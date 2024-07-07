import type { Dispatch } from "@reduxjs/toolkit";
import { eachDayOfInterval, endOfMonth, startOfMonth } from "date-fns";
import type { KyResponse } from "ky";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import "swiper/css";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { getCookie, removeCookie } from "typescript-cookie";
import ExtraincomeModal from "../../components/ExtraincomeModal";
import IncomeModal from "../../components/IncomeModal";
import IncomeModalEdit from "../../components/IncomeModalEdit";
import RecurringexpenseModal from "../../components/RecurringexpenseModal";
import { setBudget } from "../../stores/Budget";
import { setBudgets } from "../../stores/Budgets";
import { setError } from "../../stores/Error";
import { setModal } from "../../stores/Modal";
import { setUser } from "../../stores/User";
import type { IRootState, IUserResponse, TBudget, TExtraexpense, TExtraincome, TModal } from "../../types";
import { Utils, months } from "../../utils";
import "./index.css";

function Budget(): React.ReactNode {
	const dispatch: Dispatch = useDispatch();
	const navigate: NavigateFunction = useNavigate();

	const [budgetSwitch, setBudgetSwitch] = React.useState<boolean>(false);
	const [isLoading, setIsLoading] = React.useState<boolean>(true);

	const [dailyBudgetAmount, setDailyBudgetAmount] = React.useState<number>(0);
	const [monthlyBudgetAmount, setMonthlyBudgetAmount] = React.useState<number>(0);

	const budgets: TBudget[] = useSelector((state: IRootState) => state.budgets);
	const budget: TBudget = useSelector((state: IRootState) => state.budget);
	const modal: TModal = useSelector((state: IRootState) => state.modal);

	const handleGetUserResponse = React.useCallback(
		async (authorization: string): Promise<IUserResponse> => {
			try {
				const response: KyResponse = await Utils.request.get("users/get", {
					headers: {
						Authorization: `Bearer ${authorization}`,
					},
				});

				if (!response.ok) {
					return {} as IUserResponse;
				}

				const userResponse: IUserResponse = await response.json();

				if (Object.keys(userResponse).length === 0) {
					throw new Error("User response is empty");
				}

				if (userResponse.user.is_new) {
					navigate("/budget/get-started");

					return {} as IUserResponse;
				}

				if (userResponse.budgets.length === 0) {
					throw new Error("Budgets response is empty");
				}

				dispatch(setUser(userResponse.user));
				dispatch(setBudgets(userResponse.budgets));

				const currentBudget: TBudget | undefined = userResponse.budgets.find((budget: TBudget): boolean => {
					return new Date(budget.created_at).getMonth() === new Date().getMonth();
				});

				if (!currentBudget) {
					throw new Error("Current budget is undefined");
				}

				dispatch(setBudget(currentBudget));

				setTimeout((): void => setIsLoading(false), 1000);

				return userResponse;
			} catch (error) {
				if (error instanceof Error) {
					dispatch(setError(error.name));
					removeCookie("Authorization");
					window.location.reload();
				}
			}

			return {} as IUserResponse;
		},
		[dispatch, navigate],
	);

	const handleSetNewBudget = (): void => {
		try {
			navigate("/budget/new");
		} catch (error: unknown) {
			if (error instanceof Error) {
				dispatch(setError(error.message));
			}
		}
	};

	React.useEffect(() => {
		async function onLoad(): Promise<void> {
			const authorization: string | undefined = getCookie("Authorization");

			if (!authorization) {
				return navigate("/");
			}

			const userResponse: IUserResponse = await handleGetUserResponse(authorization);

			if (Object.keys(userResponse).length === 0) {
				return;
			}

			if (userResponse.user.is_new) {
				return;
			}
		}

		onLoad();
	}, [navigate, handleGetUserResponse]);

	React.useEffect(() => {
		if (Object.keys(budget).length === 0) {
			return;
		}

		const totalExtraincomes: number = budget.extraincomes.reduce((accumulator: number, extraincome: TExtraincome) => {
			return accumulator + extraincome.extraincome_amount_monthly;
		}, 0);

		if (Number.isNaN(totalExtraincomes)) {
			return;
		}

		const totalExtraexpenses: number = budget.extraexpenses.reduce(
			(accumulator: number, extraexpense: TExtraexpense) => {
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

		const dailyBudgetAmount: number = (totalExtraincomes - totalExtraexpenses) / currentDaysInMonth.length;
		const monthlyBudgetAmount: number = totalExtraincomes - totalExtraexpenses;

		setDailyBudgetAmount(dailyBudgetAmount);
		setMonthlyBudgetAmount(monthlyBudgetAmount);
	}, [budget]);

	return (
		<div className="flex justify-center bg-radial-gradient w-screen h-screen">
			{isLoading ? (
				<div className="flex items-center justify-center w-screen h-screen pb-40">
					<div className="loader" />
				</div>
			) : (
				<div className="flex flex-col gap-y-10 items-center mt-[5.3rem]">
					<div className="flex flex-col gap-y-2 items-center">
						<div className="flex flex-col gap-y-2 items-center">
							<button
								type="button"
								className="flex gap-x-2.5 items-center justify-center bg-darker px-4 py-2 rounded-[6.25rem]"
								onClick={(): void => setBudgetSwitch(!budgetSwitch)}
							>
								<span className="text-base text-grey font-normal font-rubik">
									{months[new Date(budget.created_at).getMonth()]} {"("}
									<span className="font-semibold">{new Date().getFullYear()}</span>
									{")"}
								</span>

								<svg xmlns="http://www.w3.org/2000/svg" width="28" height="27" viewBox="0 0 28 27" fill="none">
									<title>Switch</title>
									<path
										d="M3.03125 13.5C3.03125 19.5592 7.94082 24.4688 14 24.4688C20.0592 24.4688 24.9688 19.5592 24.9688 13.5C24.9688 7.44082 20.0592 2.53125 14 2.53125C7.94082 2.53125 3.03125 7.44082 3.03125 13.5ZM18.2768 11.2113C18.6723 10.8158 19.3209 10.8158 19.7164 11.2113C19.9168 11.4117 20.0117 11.6701 20.0117 11.9285C20.0117 12.1869 19.9115 12.4506 19.7111 12.651L14.7383 17.608C14.3375 17.9719 13.7205 17.9613 13.3355 17.5764L8.28887 12.5455C7.89336 12.15 7.88809 11.5066 8.28887 11.1059C8.68437 10.7104 9.32773 10.7051 9.72852 11.1059L14.0053 15.4248L18.2768 11.2113Z"
										fill="#895FF5"
									/>
								</svg>
							</button>

							{budgetSwitch && (
								<div className="absolute z-50 mt-14 flex flex-col gap-y-4 items-center justify-center w-52 py-4 bg-darker rounded-2xl">
									<div className="flex flex-col gap-y-1.5 items-center justify-center">
										{budgets.map((b: TBudget) => (
											<button
												key={b.id}
												type="button"
												onClick={() => {
													setIsLoading(true);
													setBudgetSwitch(false);
													dispatch(setBudget(b));
													setTimeout((): void => setIsLoading(false), 1000);
												}}
											>
												<span
													className={`text-sm ${
														new Date(budget.created_at).getMonth() === new Date(b.created_at).getMonth() &&
														new Date(budget.created_at).getFullYear() === new Date(b.created_at).getFullYear()
															? "text-white"
															: "text-grey"
													} font-normal font-rubik`}
												>
													{months[new Date(b.created_at).getMonth()]} {"("}
													{new Date(b.created_at).getFullYear()}
													{")"}
												</span>
											</button>
										))}
									</div>

									<button
										type="button"
										className="flex items-center justify-center bg-dark px-3 py-2 rounded-xl"
										onClick={(): void => handleSetNewBudget()}
									>
										<span className="text-sm text-light font-normal font-rubik">Create</span>
									</button>
								</div>
							)}
						</div>

						<Swiper
							className="w-[60rem] h-fit z-0"
							autoplay={{ delay: 5000, disableOnInteraction: false }}
							pagination={{ clickable: true }}
							modules={[Autoplay, Pagination]}
						>
							<SwiperSlide>
								<div className="flex flex-col gap-y-2 items-center pt-14 pb-7">
									<button
										type="button"
										onClick={(): void => {
											dispatch(
												setModal({
													extraincomeModal: false,
													recurringexpenseModal: false,
													incomeModal: true,
													incomeModalEdit: false,
												}),
											);
										}}
									>
										<h1 className="text-5xl text-purple font-bold font-rubik">{dailyBudgetAmount.toFixed(2)} €</h1>
									</button>

									<span className="text-xl text-grey font-light font-rubik">day</span>
								</div>
							</SwiperSlide>

							<SwiperSlide>
								<div className="flex flex-col gap-y-2 items-center pt-14 pb-7">
									<button
										type="button"
										onClick={(): void => {
											dispatch(
												setModal({
													extraincomeModal: false,
													recurringexpenseModal: false,
													incomeModal: true,
													incomeModalEdit: false,
												}),
											);
										}}
									>
										<h1 className="text-5xl text-purple font-bold font-rubik">{monthlyBudgetAmount.toFixed(2)} €</h1>
									</button>

									<span className="text-xl text-grey font-light font-rubik">month</span>
								</div>
							</SwiperSlide>
						</Swiper>
					</div>

					<div className="flex flex-col gap-y-5 items-center">
						<button
							type="button"
							className="flex gap-x-2 items-center justify-center btn bg-purple px-[18px] py-2.5 regular-income-glow rounded-[6.25rem]"
							onClick={(): void => {
								dispatch(
									setModal({
										extraincomeModal: true,
										recurringexpenseModal: false,
										incomeModal: false,
										incomeModalEdit: false,
									}),
								);
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<title>Trending Up</title>
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<path d="M3 17l6 -6l4 4l8 -8" />
								<path d="M14 7l7 0l0 7" />
							</svg>

							<span className="text-sm text-dark font-medium font-rubik">Income</span>
						</button>
						<button
							type="button"
							className="flex gap-x-2 items-center justify-center btn bg-orange px-[18px] py-2.5 recurring-expenses-glow rounded-[6.25rem]"
							onClick={(): void => {
								dispatch(
									setModal({
										extraincomeModal: false,
										recurringexpenseModal: true,
										incomeModal: false,
										incomeModalEdit: false,
									}),
								);
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<title>Trending Down</title>
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<path d="M3 7l6 6l4 -4l8 8" />
								<path d="M21 10l0 7l-7 0" />
							</svg>

							<span className="text-sm text-dark font-medium font-rubik">Expenses</span>
						</button>
					</div>
				</div>
			)}

			{modal.incomeModal && <IncomeModal />}
			{modal.incomeModalEdit && <IncomeModalEdit />}
			{modal.extraincomeModal && <ExtraincomeModal />}
			{modal.recurringexpenseModal && <RecurringexpenseModal />}
		</div>
	);
}

export default Budget;
