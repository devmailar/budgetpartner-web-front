import type { Dispatch } from "@reduxjs/toolkit";
import "animate.css";
import { eachDayOfInterval, endOfMonth, isWeekend, startOfMonth } from "date-fns";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import "swiper/css";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { getCookie, removeCookie } from "typescript-cookie";
import ExtraexpenseModal from "../../components/ExtraexpenseModal";
import ExtraincomeModal from "../../components/ExtraincomeModal";
import LanguageModal from "../../components/LanguageModal";
import LoginPopup from "../../components/LoginPopup";
import Modal from "../../components/Modal";
import SettingsModal from "../../components/SettingsModal";
import { setBudget } from "../../stores/Budget";
import { setBudgets } from "../../stores/Budgets";
import { setError } from "../../stores/Error";
import { setForceLogin } from "../../stores/ForceLogin";
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

	const budgets: IBudget[] = useSelector((state: IRootState) => state.budgets);
	const budget: IBudget = useSelector((state: IRootState) => state.budget);
	const modals: IModals = useSelector((state: IRootState) => state.modals);
	const forceLogin: boolean = useSelector((state: IRootState) => state.forceLogin);

	const [budgetSwitch, setBudgetSwitch] = React.useState<boolean>(false);
	const [isLoading, setIsLoading] = React.useState<boolean>(true);
	const [dailyBudgetAmount, setDailyBudgetAmount] = React.useState<number>(0);
	const [monthlyBudgetAmount, setMonthlyBudgetAmount] = React.useState<number>(0);
	const [resetBudgetModal, setResetBudgetModal] = React.useState<boolean>(false);

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
					throw new Error("Current budget is undefined");
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
						setTimeout((): void => setIsLoading(false), 1000);

						return;
					}

					dispatch(setBudget(matchingBudget));
				} else {
					dispatch(setBudget(currentBudget));
				}

				setTimeout((): void => setIsLoading(false), 1000);
			} catch (error) {
				if (error instanceof Error) {
					dispatch(setError(error.message));
					removeCookie("Authorization");
					window.location.reload();
				}
			}
		},
		[dispatch, navigate],
	);

	const handleSetNewBudget = (): void => {
		try {
			setBudgetSwitch(false);

			const auth: string = getCookie("Authorization") ?? "";
			if (!auth) {
				dispatch(setForceLogin(true));
				return;
			}

			navigate("/budget/new");
		} catch (error: unknown) {
			if (error instanceof Error) {
				dispatch(setError(error.message));
			}
		}
	};

	const handleSetBudget = (budget: IBudget): void => {
		try {
			setIsLoading(true);
			dispatch(setBudget(budget));
			setBudgetSwitch(false);
			setTimeout((): void => setIsLoading(false), 250);
		} catch (error: unknown) {
			if (error instanceof Error) {
				dispatch(setError(error.message));
			}
		}
	};

	const handleRemoveBudget = async (budget: IBudget): Promise<void> => {
		try {
			const auth: string = getCookie("Authorization") ?? "";
			if (!auth) {
				dispatch(setForceLogin(true));
				return;
			}

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
			}
		}
	};

	React.useEffect((): void => {
		const onLoad = async (): Promise<void> => {
			const auth: string = getCookie("Authorization") ?? "";
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

				setTimeout(() => setIsLoading(false), 1000);
				return;
			}

			return await handleGetUserResponse(auth);
		};

		onLoad();
	}, [dispatch, handleGetUserResponse]);

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
		<div className="flex justify-center w-screen h-screen">
			{isLoading ? (
				<div className="flex items-center justify-center w-screen h-screen pb-40">
					<div className="loader" />
				</div>
			) : (
				<div className="flex flex-col gap-y-12 items-center mt-28">
					<div className="flex flex-col gap-y-2 items-center">
						<div className="flex flex-col gap-y-2 items-center">
							<button
								type="button"
								className="flex gap-x-1 items-center justify-center bg-darker border border-grey px-4 py-2 rounded-3xl"
								onClick={(): void => setBudgetSwitch(!budgetSwitch)}
							>
								<span className="text-xl text-light font-normal font-rubik">
									{Utils.months[new Date(budget.created_at).getMonth()]} {"("}
									<span className="font-medium">{new Date().getFullYear()}</span>
									{")"}
								</span>

								<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
									<title>Arrow Down</title>
									<g clip-path="url(#clip0_316_158)">
										<path
											d="M8.75 14.583L17.5 23.333L26.25 14.583H8.75Z"
											stroke="#B7B7B7"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</g>
									<defs>
										<clipPath id="clip0_316_158">
											<rect width="35" height="35" fill="#B7B7B7" />
										</clipPath>
									</defs>
								</svg>
							</button>

							{budgetSwitch && (
								<Modal
									index={40}
									classes="gap-y-6 px-2 py-5 absolute top-44 z-50 w-60 rounded-2xl !bg-black border border-dark animate__animated animate__fadeInDown animate__faster"
								>
									<div className="flex flex-col gap-y-2.5 items-center justify-center">
										{budgets.map((b: IBudget) => (
											<button
												className="px-3 py-2 border border-light rounded-xl"
												key={b.id}
												type="button"
												onClick={(): void => handleSetBudget(b)}
											>
												<span
													className={`text-base ${
														new Date(budget.created_at).getMonth() === new Date(b.created_at).getMonth() &&
														new Date(budget.created_at).getFullYear() === new Date(b.created_at).getFullYear()
															? "text-white font-normal"
															: "text-light font-normal"
													} font-rubik`}
												>
													{Utils.months[new Date(b.created_at).getMonth()]} {"("}
													{new Date(b.created_at).getFullYear()}
													{")"}
												</span>
											</button>
										))}
									</div>

									<button type="button" onClick={(): void => handleSetNewBudget()}>
										<span className="text-base text-light font-medium font-rubik">Create</span>
									</button>
								</Modal>
							)}
						</div>

						<Swiper
							className="w-[20rem] h-fit z-0"
							autoplay={{ delay: 20000, disableOnInteraction: false }}
							pagination={{ clickable: true }}
							modules={[Autoplay, Pagination]}
						>
							<SwiperSlide>
								<div className="flex flex-col gap-y-2 items-center pt-14 pb-7">
									<span className="text-xl text-light font-normal font-rubik">
										📌 We saved in {Utils.months[new Date(budget.created_at).getMonth()]}
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
										<h1 className="animate__animated animate__fadeInUp text-6xl text-white font-bold font-rubik">
											{monthlyBudgetAmount.toFixed(1)}€
										</h1>
									</button>
								</div>
							</SwiperSlide>

							<SwiperSlide>
								<div className="flex flex-col gap-y-2 items-center pt-14 pb-7">
									<span className="text-xl text-light font-normal font-rubik">📌 We saved daily</span>

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
										<h1 className="animate__animated animate__fadeInUp text-6xl text-white font-bold font-rubik">
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

						<button
							type="button"
							className="flex gap-x-2 items-center justify-center btn bg-red px-6 py-3 rounded-3xl"
							onClick={(): void => {
								dispatch(
									setModals({
										extraincome: false,
										extraexpense: false,
										language: false,
										settings: false,
									}),

									setResetBudgetModal(true),
								);
							}}
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
								<title>Reset</title>
								<g clipPath="url(#clip0_253_109)">
									<path d="M4 7H20" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
									<path d="M10 11V17" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
									<path d="M14 11V17" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
									<path
										d="M5 7L6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19L19 7"
										stroke="black"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M9 7V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7"
										stroke="black"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</g>
								<defs>
									<clipPath id="clip0_253_109">
										<rect width="24" height="24" fill="white" />
									</clipPath>
								</defs>
							</svg>

							<span className="text-base text-dark font-medium font-rubik">Delete</span>
						</button>
					</div>

					{resetBudgetModal && (
						<Modal
							index={40}
							classes="gap-y-5 items-center justify-center px-5 py-5 w-[20rem] md:min-w-[25rem] !bg-dark animate__animated animate__fadeInUp animate__faster"
						>
							<div className="flex flex-col gap-y-2">
								<span className="text-lg text-center text-white font-medium font-rubik">Warning</span>

								<span className="text-base text-center text-light font-light font-rubik">
									This operation is permanent and will delete{" "}
									<b>
										{Utils.months[new Date(budget.created_at).getMonth()]} {"("}
										{new Date(budget.created_at).getFullYear()}
									</b>
									{")"} budget.
								</span>
							</div>

							<div className="flex gap-x-3 items-center">
								<button
									className="btn px-2.5 py-1.5 border border-red hover:bg-red text-red hover:text-light stroke-red hover:stroke-light"
									type="submit"
									onClick={(): Promise<void> => handleRemoveBudget(budget)}
								>
									<div className="flex gap-x-0 items-center">
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
											<title>Flame</title>
											<g clip-path="url(#clip0_307_158)">
												<path
													d="M12 12C14 9.04 12 5 11 4C11 7.038 9.227 8.741 8 10C6.774 11.26 6 13.24 6 15C6 16.5913 6.63214 18.1174 7.75736 19.2426C8.88258 20.3679 10.4087 21 12 21C13.5913 21 15.1174 20.3679 16.2426 19.2426C17.3679 18.1174 18 16.5913 18 15C18 13.468 16.944 11.06 16 10C14.214 13 13.209 13 12 12Z"
													stroke=""
													stroke-width="1.5"
													stroke-linecap="round"
													stroke-linejoin="round"
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
			)}

			{modals.extraincome && <ExtraincomeModal />}
			{modals.extraexpense && <ExtraexpenseModal />}
			{modals.language && <LanguageModal />}
			{modals.settings && <SettingsModal />}

			{forceLogin && <LoginPopup />}
		</div>
	);
}

export default Budget;
