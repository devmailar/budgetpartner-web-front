import type { Dispatch } from "@reduxjs/toolkit";
import "animate.css";
import { eachDayOfInterval, endOfMonth, startOfMonth } from "date-fns";
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

				return setIsLoading(false);
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
				<div className="flex flex-col gap-y-10 items-center mt-[5.3rem] zoom">
					<div className="flex flex-col gap-y-2 items-center">
						<div className="flex flex-col gap-y-2 items-center">
							<button
								type="button"
								className="animate__animated animate__boudnce flex gap-x-2.5 items-center justify-center bg-dark px-4 py-2 rounded-[6.25rem]"
								onClick={(): void => setBudgetSwitch(!budgetSwitch)}
							>
								<span className="text-base text-[#b7b7b7] font-normal font-rubik">
									{Utils.months[new Date(budget.created_at).getMonth()]} {"("}
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
								<div className="animate__animated animate__fadeInDown animate__faster absolute z-50 mt-14 flex flex-col gap-y-4 items-center justify-center w-52 py-4 bg-dark rounded-2xl">
									<div className="flex flex-col gap-y-1 items-center justify-center">
										{budgets.map((b: IBudget) => (
											<button key={b.id} type="button" onClick={(): void => handleSetBudget(b)}>
												<span
													className={`text-base ${
														new Date(budget.created_at).getMonth() === new Date(b.created_at).getMonth() &&
														new Date(budget.created_at).getFullYear() === new Date(b.created_at).getFullYear()
															? "text-white font-medium"
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

									<button
										type="button"
										className="btn bg-transparent px-3 py-2 rounded-xl"
										onClick={(): void => handleSetNewBudget()}
									>
										<span className="text-base text-purple font-medium font-rubik">Create</span>
									</button>
								</div>
							)}
						</div>

						<Swiper
							className="w-[60rem] h-fit z-0"
							autoplay={{ delay: 10000, disableOnInteraction: false }}
							pagination={{ clickable: true }}
							modules={[Autoplay, Pagination]}
						>
							<SwiperSlide>
								<div className="flex flex-col gap-y-2 items-center pt-14 pb-7">
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
										<h1 className="animate__animated animate__bounce text-5xl text-purple font-bold font-rubik">
											{dailyBudgetAmount.toFixed(2)}€
										</h1>
									</button>

									<div className="px-3 py-1 bg-dark rounded-xl">
										<span className="text-xl text-grey font-light font-rubik">day</span>
									</div>
								</div>
							</SwiperSlide>

							<SwiperSlide>
								<div className="flex flex-col gap-y-2 items-center pt-14 pb-7">
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
										<h1 className="animate__animated animate__bounce text-5xl text-purple font-bold font-rubik">
											{monthlyBudgetAmount.toFixed(2)}€
										</h1>
									</button>

									<div className="px-3 py-1 bg-dark rounded-xl">
										<span className="text-xl text-grey font-light font-rubik">month</span>
									</div>
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

							<span className="text-sm text-dark font-medium font-rubik">Income</span>
						</button>

						<button
							type="button"
							className="flex gap-x-2 items-center justify-center btn bg-orange px-[18px] py-2.5 recurring-expenses-glow rounded-[6.25rem]"
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

							<span className="text-sm text-dark font-medium font-rubik">Expenses</span>
						</button>

						<button
							type="button"
							className="flex gap-x-2 items-center justify-center btn bg-red px-[18px] py-2.5 reset-glow rounded-[6.25rem]"
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

							<span className="text-sm text-dark font-medium font-rubik">Delete</span>
						</button>
					</div>

					{resetBudgetModal && (
						<div className="absolute z-40 flex items-center justify-center w-full h-full top-0 bg-black bg-opacity-60">
							<div className="animate__animated animate__fadeInDown animate__faster min-w-80 px-2.5 py-2.5 bg-dark border border-darker rounded-2xl">
								<div className="flex flex-col gap-y-4 px-4 items-center justify-center max-w-80">
									<span className="text-base text-center text-white font-medium font-rubik">Warning</span>

									<span className="text-sm text-center text-light font-light font-rubik">
										This operation is permanent and will delete budget for{" "}
										{Utils.months[new Date(budget.created_at).getMonth()]} {"("}
										<span className="font-semibold">{new Date(budget.created_at).getFullYear()}</span>
										{")"}
									</span>

									<div className="flex gap-2 items-center">
										<button
											type="submit"
											className="btn bg-transparent px-3 py-2 rounded-xl"
											onClick={(): Promise<void> => handleRemoveBudget(budget)}
										>
											<span className="text-base text-red font-medium font-rubik">Delete</span>
										</button>

										<button
											type="submit"
											className="btn bg-transparent px-3 py-2 rounded-xl"
											onClick={(): void => setResetBudgetModal(false)}
										>
											<span className="text-base text-light font-medium font-rubik">Cancel</span>
										</button>
									</div>
								</div>
							</div>
						</div>
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
