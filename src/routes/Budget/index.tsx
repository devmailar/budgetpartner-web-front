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
import { setError } from "../../stores/Error";
import { setExtraincomes } from "../../stores/Extraincomes";
import { setModal } from "../../stores/Modal";
import { setRecurringexpenses } from "../../stores/Recurringexpenses";
import { setUser } from "../../stores/User";
import type { IRootState, IUserResponse, TExtraincome, TModal, TRecurringexpense } from "../../types";
import { Utils } from "../../utils";
import "./index.css";

function Budget() {
	const dispatch: Dispatch = useDispatch();
	const navigate: NavigateFunction = useNavigate();

	const [incomeAmountDaily, setIncomeAmountDaily] = React.useState<number>(0);
	const [incomeAmountMonthly, setIncomeAmountMonthly] = React.useState<number>(0);
	const [incomeAmountYearly, setIncomeAmountYearly] = React.useState<number>(0);

	const modal: TModal = useSelector((state: IRootState) => state.modal);

	const [isLoading, setIsLoading] = React.useState<boolean>(true);

	const handleGetUserResponse = React.useCallback(
		async (authorization: string): Promise<IUserResponse> => {
			try {
				const response: KyResponse = await Utils.request.get("users/get", {
					headers: {
						Authorization: `Bearer ${authorization}`,
					},
				});

				const userResponse: IUserResponse = await response.json();

				if (Object.keys(userResponse).length === 0) {
					dispatch(setError("UserResponse not found!"));
				}

				if (userResponse.user.is_new) {
					navigate("/budget/get-started");
				}

				dispatch(setUser(userResponse.user));
				dispatch(setBudget(userResponse.budget));
				dispatch(setExtraincomes(userResponse.extraincomes));
				dispatch(setRecurringexpenses(userResponse.recurringexpenses));

				const totalExtraincomes: number = userResponse.extraincomes.reduce(
					(accumulator: number, extraincome: TExtraincome) => {
						return accumulator + extraincome.extraincome_amount_monthly;
					},
					0,
				);

				const totalRecurringexpenses: number = userResponse.recurringexpenses.reduce(
					(accumulator: number, recurringexpense: TRecurringexpense) => {
						return accumulator + recurringexpense.recurringexpense_amount_monthly;
					},
					0,
				);

				const currentDaysInMonth: Date[] = eachDayOfInterval({
					start: startOfMonth(new Date()),
					end: endOfMonth(new Date()),
				});

				const dailyIncomeAmount: number =
					(userResponse.budget.income_amount_monthly + totalExtraincomes - totalRecurringexpenses) /
					currentDaysInMonth.length;

				const dailyIncomeMonthly: number =
					userResponse.budget.income_amount_monthly + totalExtraincomes - totalRecurringexpenses;

				const dailyIncomeYearly: number =
					(userResponse.budget.income_amount_monthly + totalExtraincomes - totalRecurringexpenses) * 12;

				setIncomeAmountDaily(dailyIncomeAmount);
				setIncomeAmountMonthly(dailyIncomeMonthly);
				setIncomeAmountYearly(dailyIncomeYearly);

				setTimeout((): void => {
					setIsLoading(false);
				}, 1000);

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

	return (
		<div className="flex justify-center bg-radial-gradient w-screen h-screen">
			{isLoading ? (
				<div className="flex items-center justify-center w-screen h-screen pb-40">
					<div className="loader" />
				</div>
			) : (
				<div className="flex flex-col gap-y-10 items-center mt-[4.4rem]">
					<div className="flex flex-col items-center">
						<nav className="flex items-center p-1 bg-[#202020] rounded-full">
							<button
								type="button"
								className="flex items-center justify-center bg-transparent px-11 py-3 rounded-full"
								onClick={(): void => {
									dispatch(setError("Previous year budget cannot be accessed 🚫"));
								}}
							>
								<span className="text-base text-[#4B4B4B] font-normal font-rubik">{new Date().getFullYear() - 1}</span>
							</button>

							<button type="button" className="flex items-center justify-center primary px-11 py-3 rounded-full">
								<span className="text-base text-[#FFFFFF] font-normal font-rubik">{new Date().getFullYear()}</span>
							</button>
						</nav>

						<Swiper
							className="w-[60rem] h-fit z-0"
							autoplay={{ delay: 5000, disableOnInteraction: false }}
							pagination={{ clickable: true }}
							modules={[Autoplay, Pagination]}
						>
							<SwiperSlide>
								<div className="flex flex-col gap-y-1 items-center pt-10 pb-10">
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
										<h1 className="text-[2.4rem] text-[#895FF5] font-extrabold font-rubik">
											{incomeAmountDaily.toFixed(2)} €
										</h1>
									</button>

									<span className="text-base text-[#895FF5] font-thin font-rubik">DA</span>
								</div>
							</SwiperSlide>

							<SwiperSlide>
								<div className="flex flex-col gap-y-1 items-center pt-10 pb-10">
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
										<h1 className="text-[2.4rem] text-[#895FF5] font-extrabold font-rubik">
											{incomeAmountMonthly.toFixed(2)} €
										</h1>
									</button>

									<span className="text-base text-[#895FF5] font-thin font-rubik">MO</span>
								</div>
							</SwiperSlide>

							<SwiperSlide>
								<div className="flex flex-col gap-y-1 items-center pt-10 pb-10">
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
										<h1 className="text-[2.4rem] text-[#895FF5] font-extrabold font-rubik">
											{incomeAmountYearly.toFixed(2)} €
										</h1>
									</button>

									<span className="text-base text-[#895FF5] font-thin font-rubik">YE</span>
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
										recurringexpenseModal: false,
										incomeModal: false,
										incomeModalEdit: false,
									}),
								);
							}}
						>
							<span className="text-lg text-black font-medium font-rubik">+</span>

							<span className="text-sm text-black font-medium font-rubik">Extra income</span>
						</button>

						<button
							type="button"
							className="flex gap-x-2 items-center justify-center btn bg-[#9E553C] px-4 py-1.5 recurring-expenses-glow rounded-full"
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
							<span className="text-lg text-black font-medium font-rubik">+</span>

							<span className="text-sm text-black font-medium font-rubik">Recurring expenses</span>
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
