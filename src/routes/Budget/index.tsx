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
import IncomeModalEdit from "../../components/IncomeModalEdit";
import { setBudget } from "../../stores/Budget";
import { setError } from "../../stores/Error";
import { setModal } from "../../stores/Modal";
import { setUser } from "../../stores/User";
import type { IRootState, TBudget, TModal, TUser } from "../../types";
import { request } from "../../utils";
import "./index.css";

function Budget() {
	const dispatch: Dispatch = useDispatch();
	const navigate: NavigateFunction = useNavigate();

	const budget: TBudget = useSelector((state: IRootState) => state.budget);
	const modal: TModal = useSelector((state: IRootState) => state.modal);

	const [isLoading, setIsLoading] = React.useState<boolean>(true);

	const handleGetUser = React.useCallback(
		async (authorization: string): Promise<TUser> => {
			try {
				const response: KyResponse = await request.get("users/get-one", {
					headers: {
						Authorization: `Bearer ${authorization}`,
					},
				});

				const user: TUser = await response.json();

				if (Object.keys(user).length === 0) {
					dispatch(setError("User not found! 🚫"));
					return {} as TUser;
				}

				dispatch(setUser(user));

				if (user.is_new) navigate("/budget/get-started");

				return user;
			} catch (error) {
				if (error instanceof Error) {
					dispatch(setError(error.name));
					removeCookie("Authorization");
					window.location.reload();
				}
			}

			return {} as TUser;
		},
		[dispatch, navigate],
	);

	const handleGetBudget = React.useCallback(
		async (authorization: string): Promise<void> => {
			try {
				const response: KyResponse = await request.get("budgets/get-one", {
					headers: {
						Authorization: `Bearer ${authorization}`,
					},
				});

				const budget: TBudget = await response.json();

				if (Object.keys(budget).length === 0) {
					dispatch(setError("Budget not found! 🚫"));
					return;
				}

				// TODO: Fetch extra income and recurring expenses and set them in the budget state as well
				dispatch(
					setBudget({
						user_id: budget.user_id,
						income_amount_total: budget.income_amount_monthly,
						income_amount_monthly: budget.income_amount_monthly,
						created_at: budget.created_at,
						updated_at: budget.updated_at,
					}),
				);

				setTimeout((): void => setIsLoading(false), 1000);
			} catch (error) {
				if (error instanceof Error) {
					dispatch(setError(error.name));
				}
			}
		},
		[dispatch],
	);

	React.useEffect(() => {
		async function onLoad(): Promise<void> {
			const authorization: string | undefined = getCookie("Authorization");

			if (!authorization) {
				return navigate("/");
			}

			const user: TUser = await handleGetUser(authorization);

			if (Object.keys(user).length === 0) {
				return;
			}

			if (user.is_new) {
				return;
			}

			return handleGetBudget(authorization);
		}

		onLoad();
	}, [navigate, handleGetUser, handleGetBudget]);

	const currentDaysInMonth: Date[] = eachDayOfInterval({
		start: startOfMonth(new Date()),
		end: endOfMonth(new Date()),
	});

	const incomeAmountDaily: number =
		budget.income_amount_monthly / currentDaysInMonth.length || 0;
	const incomeAmountMonthly: number = budget.income_amount_monthly || 0;
	const incomeAmountYearly: number = budget.income_amount_monthly * 12 || 0;

	return (
		<div className="flex items-start justify-center bg-radial-gradient w-screen h-screen">
			{isLoading ? (
				<div className="flex items-center justify-center w-screen h-screen pb-40">
					<div className="loader" />
				</div>
			) : (
				<div className="flex flex-col gap-y-16 items-center mt-24">
					<div className="flex flex-col items-center">
						<nav className="flex items-center p-1 bg-[#202020] rounded-full">
							<button
								type="button"
								className="flex items-center justify-center bg-transparent px-10 py-2.5 rounded-full"
								onClick={(): void => {
									dispatch(
										setError("Previous year budget cannot be accessed! 🚫"),
									);
								}}
							>
								<span className="text-base text-[#4B4B4B] font-normal font-rubik">
									{new Date().getFullYear() - 1}
								</span>
							</button>

							<button
								type="button"
								className="flex items-center justify-center primary px-10 py-2.5 rounded-full"
							>
								<span className="text-base text-[#FFFFFF] font-normal font-rubik">
									{new Date().getFullYear()}
								</span>
							</button>
						</nav>

						<Swiper
							className="w-[60rem] h-fit"
							autoplay={{ delay: 5000, disableOnInteraction: false }}
							pagination={{ clickable: true }}
							modules={[Autoplay, Pagination]}
						>
							<SwiperSlide>
								<div className="flex flex-col gap-y-4 items-center py-8">
									<button
										type="button"
										onClick={(): void => {
											dispatch(
												setModal({
													extraincomeModal: false,
													recurringexpensesModal: false,
													incomeModalEdit: true,
												}),
											);
										}}
									>
										<h1 className="text-[2rem] text-[#895FF5] font-black font-rubik">
											{incomeAmountDaily.toFixed(2)} €
										</h1>
									</button>

									<span className="text-base text-[#895FF5] font-light font-rubik">
										/day
									</span>
								</div>
							</SwiperSlide>

							<SwiperSlide>
								<div className="flex flex-col gap-y-4 items-center py-8">
									<button
										type="button"
										onClick={(): void => {
											dispatch(
												setModal({
													extraincomeModal: false,
													recurringexpensesModal: false,
													incomeModalEdit: true,
												}),
											);
										}}
									>
										<h1 className="text-[2rem] text-[#895FF5] font-black font-rubik">
											{incomeAmountMonthly.toFixed(2)} €
										</h1>
									</button>

									<span className="text-base text-[#895FF5] font-light font-rubik">
										/month
									</span>
								</div>
							</SwiperSlide>

							<SwiperSlide>
								<div className="flex flex-col gap-y-4 items-center py-8">
									<button
										type="button"
										onClick={(): void => {
											dispatch(
												setModal({
													extraincomeModal: false,
													recurringexpensesModal: false,
													incomeModalEdit: true,
												}),
											);
										}}
									>
										<h1 className="text-[2rem] text-[#895FF5] font-black font-rubik">
											{incomeAmountYearly.toFixed(2)} €
										</h1>
									</button>

									<span
										className={"text-base text-[#895FF5] font-light font-rubik"}
									>
										/year
									</span>
								</div>
							</SwiperSlide>
						</Swiper>
					</div>

					<div className="flex flex-col gap-y-4 items-center">
						<button
							type="button"
							className="flex gap-x-2 items-center justify-center btn bg-[#895FF5] px-4 py-1.5 regular-income-glow rounded-full"
							onClick={(): void => {
								dispatch(
									setModal({
										extraincomeModal: true,
										recurringexpensesModal: false,
										incomeModalEdit: false,
									}),
								);
							}}
						>
							<span className="text-lg text-black font-medium font-rubik">
								+
							</span>

							<span className="text-sm text-black font-medium font-rubik">
								Extra income
							</span>
						</button>

						<button
							type="button"
							className="flex gap-x-2 items-center justify-center btn bg-[#9E553C] px-4 py-1.5 recurring-expenses-glow rounded-full"
							onClick={(): void => {
								dispatch(
									setModal({
										extraincomeModal: false,
										recurringexpensesModal: true,
										incomeModalEdit: false,
									}),
								);
							}}
						>
							<span className="text-lg text-black font-medium font-rubik">
								+
							</span>

							<span className="text-sm text-black font-medium font-rubik">
								Recurring expenses
							</span>
						</button>
					</div>
				</div>
			)}

			{modal.incomeModalEdit && <IncomeModalEdit />}
			{modal.extraincomeModal && <ExtraincomeModal />}
		</div>
	);
}

export default Budget;
