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
import Modal from "../../components/Modal";
import { setBudget } from "../../stores/Budget";
import { setError } from "../../stores/Error";
import { setUser } from "../../stores/User";
import type { IRootState, TBudget, TUser } from "../../types";
import { request } from "../../utils";
import "./index.css";

function Budget() {
	const dispatch: Dispatch = useDispatch();
	const navigate: NavigateFunction = useNavigate();

	const budget: TBudget = useSelector((state: IRootState) => state.budget);

	const [openEditIncome, setOpenEditIncome] = React.useState<boolean>(false);

	const handleGetUser = React.useCallback(
		async (authorization: string): Promise<TUser> => {
			try {
				const response = await request.get("users/get-one", {
					headers: {
						Authorization: `Bearer ${authorization}`,
					},
				});

				const user: TUser = await response.json();
				dispatch(setUser(user));

				if (user.is_new) {
					navigate("/budget/get-started");
				}

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

				dispatch(setBudget(budget));
			} catch (error) {
				if (error instanceof Error) {
					dispatch(setError(error.name));
				}
			}
		},
		[dispatch],
	);

	const handleSubmitEditIncome = async (
		event: React.FormEvent<HTMLFormElement>,
	): Promise<void> => {
		try {
			setError("");

			event.preventDefault();

			const form: FormData = new FormData(event.currentTarget);
			const income: number = Number.parseInt(form.get("income") as string);
			const authorization: string | undefined = getCookie("Authorization");

			if (!authorization) {
				dispatch(setError("Please login to continue"));
				return;
			}

			if (income <= 0 || Number.isNaN(income)) {
				dispatch(setError("Please enter valid amount"));
				return;
			}

			await request.post("budgets/update", {
				json: {
					income_amount_monthly: income,
				},
				headers: {
					Authorization: `Bearer ${authorization}`,
				},
			});

			window.location.reload();
		} catch (error: unknown) {
			if (error instanceof Error) {
				dispatch(setError("Failed to update income! 😢"));
			}
		}
	};

	const currentDaysInMonth: Date[] = eachDayOfInterval({
		start: startOfMonth(new Date()),
		end: endOfMonth(new Date()),
	});

	React.useEffect(() => {
		async function onLoad(): Promise<void> {
			const authorization: string | undefined = getCookie("Authorization");

			if (!authorization) {
				return navigate("/");
			}

			const user: TUser = await handleGetUser(authorization);

			if (user.is_new) {
				return;
			}

			handleGetBudget(authorization);
		}

		onLoad();
	}, [navigate, handleGetUser, handleGetBudget]);

	const incomeAmountDaily: number =
		budget.income_amount_monthly / currentDaysInMonth.length || 0;
	const incomeAmountMonthly: number = budget.income_amount_monthly || 0;
	const incomeAmountYearly: number = budget.income_amount_monthly * 12 || 0;

	return (
		<div className="flex items-start justify-center bg-radial-gradient w-screen h-screen">
			<div className="flex flex-col gap-y-16 items-center mt-[4.5rem]">
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
						autoplay={{
							delay: 5000,
							disableOnInteraction: false,
						}}
						pagination={{
							clickable: true,
						}}
						modules={[Autoplay, Pagination]}
					>
						<SwiperSlide>
							<div className="flex flex-col gap-y-1 items-center py-11">
								<button
									type="button"
									onClick={(): void => setOpenEditIncome(true)}
								>
									<h1 className="text-3xl text-[#895FF5] font-black font-rubik">
										{incomeAmountDaily.toFixed(2)}€
									</h1>
								</button>

								<span className="text-base text-[#895FF5] font-light font-rubik">
									/day
								</span>
							</div>
						</SwiperSlide>

						<SwiperSlide>
							<div className="flex flex-col gap-y-1 items-center py-11">
								<button
									type="button"
									onClick={(): void => setOpenEditIncome(true)}
								>
									<h1 className="text-3xl text-[#895FF5] font-black font-rubik">
										{incomeAmountMonthly.toFixed(2)}€
									</h1>
								</button>

								<span className="text-base text-[#895FF5] font-light font-rubik">
									/month
								</span>
							</div>
						</SwiperSlide>

						<SwiperSlide>
							<div className="flex flex-col gap-y-1 items-center py-11">
								<button
									type="button"
									onClick={(): void => setOpenEditIncome(true)}
								>
									<h1 className="text-3xl text-[#895FF5] font-black font-rubik">
										{incomeAmountYearly.toFixed(2)}€
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
					>
						<span className="text-lg text-black font-medium font-rubik">+</span>

						<span className="text-sm text-black font-medium font-rubik">
							Extra income
						</span>
					</button>

					<button
						type="button"
						className="flex gap-x-2 items-center justify-center btn bg-[#9E553C] px-4 py-1.5 recurring-expenses-glow rounded-full"
					>
						<span className="text-lg text-black font-medium font-rubik">+</span>

						<span className="text-sm text-black font-medium font-rubik">
							Recurring expenses
						</span>
					</button>
				</div>
			</div>

			{openEditIncome && (
				<Modal index={10}>
					<form
						className="flex flex-col gap-y-6 px-4 py-4"
						onSubmit={handleSubmitEditIncome}
					>
						<span className="text-sm text-[#FFFFFF] font-medium font-rubik">
							Set new regular income ✍️
						</span>

						<div className="flex gap-x-4 items-center justify-between p-2 border-[1px] border-[#4B4B4B] rounded-lg">
							<input
								className="bg-transparent w-full text-sm text-white placeholder:text-white font-light font-rubik focus:outline-none"
								type="number"
								name="income"
								id="income"
								placeholder={budget.income_amount_monthly.toString()}
								required
							/>

							<span className="text-xs text-white font-light font-rubik">
								EUR/MONTH
							</span>
						</div>

						<div className="flex flex-col gap-y-4">
							<button
								type="submit"
								className="btn bg-[#895FF5] py-2 rounded-lg"
							>
								<span className="text-xs text-white font-medium font-rubik">
									Save
								</span>
							</button>

							<button
								type="button"
								className="btn border-t-[1px] border-t-[#242424]"
								onClick={() => setOpenEditIncome(false)}
							>
								<span className="text-sm text-[#895FF5] font-normal">
									Cancel
								</span>
							</button>
						</div>
					</form>
				</Modal>
			)}
		</div>
	);
}

export default Budget;
