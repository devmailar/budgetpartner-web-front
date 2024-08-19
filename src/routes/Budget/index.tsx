import type { Dispatch } from "@reduxjs/toolkit";
import "animate.css";
import { eachDayOfInterval, endOfMonth, isWeekend, startOfMonth } from "date-fns";
import React from "react";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import "swiper/css";
import { Autoplay } from "swiper/modules";
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

		const includesWeekends: boolean = budget.extraincomes.some((extraincome: IExtraincome) => {
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

		// TODO: Check if budget.extraincome.map((ei => )) has extraincome_includes_weekends set to true ..then calculate for that extraincome daysInMonth instead of weekdaysInMonth

		// Can we allow player to set if monthly budget income is from fullweek or like 5 days counted.

		// As now everything is defined by the weekays in that month, so income happens only in weekdays.

		// That doesn't make sense, as some people might have stocks that happen every weekend when counting dailyBudget

		const dailyBudgetAmount: number = includesWeekends
			? (totalExtraincomes - totalExtraexpenses) / daysInMonth.length
			: (totalExtraincomes - totalExtraexpenses) / weekdaysInMonth.length;

		const monthlyBudgetAmount: number = totalExtraincomes - totalExtraexpenses;

		setDailyBudgetAmount(dailyBudgetAmount);
		setMonthlyBudgetAmount(monthlyBudgetAmount);
	}, [budget]);

	return (
		<div className="flex flex-col gap-y-20">
			<div className="flex flex-col gap-y-4 items-center">
				<div className="flex flex-col gap-y-2 items-center">
					<BudgetSwitch />

					<Swiper
						className="w-[20rem] md:w-[30rem] h-fit z-0"
						modules={[Autoplay]}
						autoplay={{ delay: 10000, disableOnInteraction: false }}
					>
						<SwiperSlide>
							<div className="flex flex-col gap-y-2 items-center py-8">
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

						<SwiperSlide>
							<div className="flex flex-col gap-y-1 items-center py-8">
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
					</Swiper>
				</div>

				<div className="flex flex-col gap-y-3 items-center">
					{auth && monthlyBudgetAmount === 0 && (
						<span className="text-center text-sm text-white font-normal font-rubik">⬇️ Please add your income ⬇️</span>
					)}

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

						<span className="text-base text-[#160C1F] font-medium font-rubik">Income</span>
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

						<span className="text-base text-[#160C1F] font-medium font-rubik">Expenses</span>
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

			<div className="flex flex-col md:flex-row gap-4 items-center">
				<div className="flex flex-col gap-y-2.5 items-center w-80 py-5 border-t border-t-[#313131]">
					<h3 className="text-base text-white font-bold font-rubik text-center">Easy Setup</h3>

					<p className="text-sm text-white font-normal font-rubik text-center">
						Budget Partner is designed for beginners. Set up your budget quickly, track income, and record expenses
						effortlessly. No more complicated spreadsheets or confusing apps!
					</p>
				</div>

				<div className="flex flex-col gap-y-2.5 items-center w-80 py-5 border-t border-t-[#313131]">
					<h3 className="text-base text-white font-bold font-rubik text-center">Secure Data Storage</h3>

					<p className="text-sm text-white font-normal font-rubik text-center">
						Your financial information is safe with us. Budget Partner securely stores your data, allowing you to
						revisit your progress over time. It’s like having a personal financial assistant at your fingertips.
					</p>
				</div>

				<div className="flex flex-col gap-y-2.5 items-center w-80 py-5 border-t border-t-[#313131]">
					<h3 className="text-base text-white font-bold font-rubik text-center">Track Your Journey</h3>

					<p className="text-sm text-white font-normal font-rubik text-center">
						Compare your financial milestones and see how far you’ve come. Whether you’re saving for a dream vacation or
						building an emergency fund, Budget Partner keeps you motivated.
					</p>
				</div>
			</div>

			{modals.extraincome && <ExtraincomeModal />}
			{modals.extraexpense && <ExtraexpenseModal />}
			{modals.language && <LanguageModal />}
			{modals.settings && <SettingsModal />}

			{forceLogin && <LoginPopup />}
		</div>
	);
}

export default Budget;
