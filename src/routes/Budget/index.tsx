import type { Dispatch } from "@reduxjs/toolkit";
import "animate.css";
import { eachDayOfInterval, endOfMonth, isWeekend, startOfMonth } from "date-fns";
import React from "react";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import "swiper/css";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import BudgetSwitch from "../../components/BudgetSwitch";
import ExtraexpenseModal from "../../components/ExtraexpenseModal";
import ExtraincomeModal from "../../components/ExtraincomeModal";
import LanguageModal from "../../components/LanguageModal";
import LoginPopup from "../../components/LoginPopup";
import Modal from "../../components/Modal";
import SettingsModal from "../../components/SettingsModal";
import { setAuth } from "../../stores/Auth";
import { setBudget } from "../../stores/Budget";
import { setBudgets } from "../../stores/Budgets";
import { setError } from "../../stores/Error";
import { setLoader } from "../../stores/Loader";
import { setModals } from "../../stores/Modals";
import { setUser } from "../../stores/User";
import type {
	IBudget,
	IExtraexpense,
	IExtraincome,
	IModals,
	IResponseError,
	IRootState,
	IUserResponse,
} from "../../types";
import { Utils } from "../../utils";
import "./index.css";

function Budget(): React.ReactNode {
	const dispatch: Dispatch = useDispatch();
	const navigate: NavigateFunction = useNavigate();

	const auth: string = useSelector((state: IRootState) => state.auth);

	const budget: IBudget = useSelector((state: IRootState) => state.budget);
	const modals: IModals = useSelector((state: IRootState) => state.modals);
	const forceLogin: boolean = useSelector((state: IRootState) => state.forceLogin);

	const [dailyBudgetAmount, setDailyBudgetAmount] = React.useState<number>(0);
	const [monthlyBudgetAmount, setMonthlyBudgetAmount] = React.useState<number>(0);
	const [resetBudgetModal, setResetBudgetModal] = React.useState<boolean>(false);

	const [removeBudgetButtonDisabled, setRemoveBudgetButtonDisabled] = React.useState<boolean>(false);

	const handleGetUserResponse = React.useCallback(
		async (auth: string): Promise<void> => {
			try {
				const getUserResponse: Response = await fetch(`${Utils.baseurl}/users/get`, {
					method: "GET",
					headers: { Authorization: `Bearer ${auth}` },
				});

				if (!getUserResponse.ok) {
					const getUserResponseError: IResponseError = await getUserResponse.json();

					throw new Error(getUserResponseError.message);
				}

				const getUserResponseBody: IUserResponse = await getUserResponse.json();

				if (Object.keys(getUserResponseBody).length === 0) {
					throw new Error("User response is empty");
				}

				if (getUserResponseBody.user.is_new) {
					return navigate("/budget/get-started");
				}

				if (getUserResponseBody.budgets.length === 0) {
					throw new Error("Budgets response is empty");
				}

				dispatch(setUser(getUserResponseBody.user));
				dispatch(setBudgets(getUserResponseBody.budgets));

				const currentBudget: IBudget | undefined = getUserResponseBody.budgets.find((budget: IBudget): boolean => {
					return new Date(budget.created_at).getMonth() === new Date().getMonth();
				});

				if (!currentBudget) {
					return navigate("/budget/get-started");
				}

				const storedBudgetDate: string = localStorage.getItem("budget") ?? "";
				if (storedBudgetDate) {
					const matchingBudget: IBudget | undefined = getUserResponseBody.budgets.find((budget: IBudget): boolean => {
						const budgetDate: Date = new Date(budget.created_at);
						const match: boolean = budgetDate.toISOString() === storedBudgetDate;

						return match;
					});

					if (!matchingBudget) {
						dispatch(setBudget(currentBudget));

						setTimeout((): void => {
							dispatch(setLoader(false));
						}, 1000);

						return;
					}

					dispatch(setBudget(matchingBudget));
				} else {
					dispatch(setBudget(currentBudget));
				}

				setTimeout((): void => {
					dispatch(setLoader(false));
				}, 1000);
			} catch (error) {
				if (error instanceof Error) {
					dispatch(setError(error.message));
					dispatch(setAuth(""));
					window.location.reload();
				}
			}
		},
		[dispatch, navigate],
	);

	const handleRemoveBudget = async (budget: IBudget): Promise<void> => {
		try {
			setRemoveBudgetButtonDisabled(true);

			if (new Date(budget.created_at).getMonth() === new Date().getMonth()) {
				throw new Error("You cant delete present budget");
			}

			const removeBudgetResponse: Response = await fetch(`${Utils.baseurl}/budgets/remove/${budget.id}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${auth}` },
			});

			if (!removeBudgetResponse.ok) {
				const removeBudgetResponseError: IResponseError = await removeBudgetResponse.json();

				throw new Error(removeBudgetResponseError.message);
			}

			localStorage.removeItem("budget");
			window.location.reload();
		} catch (error: unknown) {
			if (error instanceof Error) {
				dispatch(setError(error.message));
				setTimeout((): void => setRemoveBudgetButtonDisabled(false), 2000);
			}
		}
	};

	React.useEffect((): void => {
		const onLoad = async (): Promise<void> => {
			if (!auth) {
				dispatch(
					setBudget({
						id: 0,
						user_id: 0,
						extraincomes: [] as IExtraincome[],
						extraexpenses: [] as IExtraexpense[],
						created_at: new Date().toISOString(),
						updated_at: new Date().toISOString(),
					}),
				);

				setTimeout((): void => {
					dispatch(setLoader(false));
				}, 1000);
				return;
			}

			return await handleGetUserResponse(auth);
		};

		onLoad();
	}, [auth, dispatch, handleGetUserResponse]);

	React.useEffect(() => {
		if (Object.keys(budget).length === 0) {
			return;
		}

		const totalExtraincomes: number = budget.extraincomes.reduce((accumulator: number, extraincome: IExtraincome) => {
			return accumulator + extraincome.extraincome_amount_monthly;
		}, 0);

		if (Number.isNaN(totalExtraincomes)) {
			return;
		}

		const totalExtraexpenses: number = budget.extraexpenses.reduce(
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

		const weekdaysInMonth: Date[] = currentDaysInMonth.filter((day: Date) => !isWeekend(day));

		// Can we allow player to set if monthly budget income is from fullweek or like 5 days counted.

		// As now everything is defined by the weekays in that month, so income happens only in weekdays.

		// That doesn't make sense, as some people might have stocks that happen every weekend when counting dailyBudget

		const dailyBudgetAmount: number = (totalExtraincomes - totalExtraexpenses) / weekdaysInMonth.length;
		const monthlyBudgetAmount: number = totalExtraincomes - totalExtraexpenses;

		setDailyBudgetAmount(dailyBudgetAmount);
		setMonthlyBudgetAmount(monthlyBudgetAmount);
	}, [budget]);

	return (
		<>
			<div className="flex flex-col gap-y-12 items-center">
				<div className="flex flex-col gap-y-2 items-center">
					<BudgetSwitch />

					<Swiper
						className="w-[20rem] md:w-[30rem] h-fit z-0"
						autoplay={{ delay: 20000, disableOnInteraction: false }}
						pagination={{ clickable: true }}
						modules={[Autoplay, Pagination]}
					>
						<SwiperSlide>
							<div className="flex flex-col gap-y-1 items-center pt-14 pb-7">
								<span className="text-base text-[#57456F] font-medium font-rubik">
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
									<h1 className="animate__animated animate__fadeInUp text-5xl text-white font-bold font-rubik">
										{monthlyBudgetAmount.toFixed(2)}€
									</h1>
								</button>
							</div>
						</SwiperSlide>

						<SwiperSlide>
							<div className="flex flex-col gap-y-2 items-center pt-14 pb-7">
								<span className="text-base text-[#57456F] font-medium font-rubik">
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
									<h1 className="animate__animated animate__fadeInUp text-5xl text-white font-bold font-rubik">
										{dailyBudgetAmount.toFixed(2)}€
									</h1>
								</button>
							</div>
						</SwiperSlide>
					</Swiper>
				</div>

				<div className="flex flex-col gap-y-3 items-center">
					<button
						type="button"
						className="flex gap-x-2 items-center justify-center btn bg-purple px-6 py-3 rounded-3xl"
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

						<span className="text-base text-dark font-medium font-rubik">Income</span>
					</button>

					<button
						type="button"
						className="flex gap-x-2 items-center justify-center btn bg-orange px-6 py-3 rounded-3xl"
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

						<span className="text-base text-dark font-medium font-rubik">Expenses</span>
					</button>
				</div>

				{resetBudgetModal && (
					<Modal
						index={40}
						classes="gap-y-3 items-center justify-center px-6 py-6 w-[20rem] md:min-w-[26rem] animate__animated animate__fadeInUp animate__faster"
					>
						<div className="flex flex-col gap-y-2">
							<span className="text-lg text-center text-white font-medium font-rubik">Warning</span>

							<span className="text-base text-center text-light font-light font-rubik">
								This operation is permanent and will delete{" "}
								<b>
									{Utils.months[new Date(budget.created_at).getMonth()]}
									{new Date(budget.created_at).getFullYear()}
								</b>{" "}
								budget.
							</span>
						</div>

						<div className="flex gap-x-3 items-center">
							<button
								className="btn px-2.5 py-1.5 border border-red hover:bg-red text-red hover:text-light stroke-red hover:stroke-light"
								type="submit"
								onClick={(): Promise<void> => handleRemoveBudget(budget)}
								disabled={removeBudgetButtonDisabled}
							>
								<div className="flex gap-x-0 items-center">
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
										<title>Flame</title>
										<g clipPath="url(#clip0_307_158)">
											<path
												d="M12 12C14 9.04 12 5 11 4C11 7.038 9.227 8.741 8 10C6.774 11.26 6 13.24 6 15C6 16.5913 6.63214 18.1174 7.75736 19.2426C8.88258 20.3679 10.4087 21 12 21C13.5913 21 15.1174 20.3679 16.2426 19.2426C17.3679 18.1174 18 16.5913 18 15C18 13.468 16.944 11.06 16 10C14.214 13 13.209 13 12 12Z"
												stroke=""
												strokeWidth="1.5"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</g>
										<defs>
											<clipPath id="clip0_307_158">
												<rect width="24" height="24" fill="" />
											</clipPath>
										</defs>
									</svg>

									<span className="text-base font-normal font-rubik">Delete</span>
								</div>
							</button>

							<button
								type="submit"
								className="btn px-2.5 py-1.5 border border-light"
								onClick={(): void => setResetBudgetModal(false)}
							>
								<span className="text-base text-light font-normal font-rubik">Cancel</span>
							</button>
						</div>
					</Modal>
				)}
			</div>

			{modals.extraincome && <ExtraincomeModal />}
			{modals.extraexpense && <ExtraexpenseModal />}
			{modals.language && <LanguageModal />}
			{modals.settings && <SettingsModal />}

			{forceLogin && <LoginPopup />}
		</>
	);
}

export default Budget;
