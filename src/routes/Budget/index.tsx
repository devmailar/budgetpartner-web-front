import type { Dispatch } from "@reduxjs/toolkit";
import type { KyResponse } from "ky";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import "swiper/css";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { getCookie, removeCookie } from "typescript-cookie";
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

	return (
		<div className="flex items-start justify-center bg-radial-gradient w-screen h-screen">
			<div className="flex flex-col gap-y-8 items-center mt-28">
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
							<span className="text-base text-white font-normal font-rubik">
								{new Date().getFullYear()}
							</span>
						</button>
					</nav>

					<Swiper
						className="w-[40rem] h-fit"
						autoplay={{
							delay: 3500,
							disableOnInteraction: false,
						}}
						pagination={{
							clickable: true,
						}}
						modules={[Autoplay, Pagination]}
					>
						<SwiperSlide>
							<div className="flex flex-col gap-y-2 items-center py-11">
								<h1 className="text-[2.8rem] text-[#895FF5] font-black font-rubik">
									{budget.income_amount_monthly?.toFixed(2)} €
								</h1>

								<span className="text-xl text-[#895FF5] font-light font-rubik">
									/day
								</span>
							</div>
						</SwiperSlide>

						<SwiperSlide>
							<div className="flex flex-col gap-y-2 items-center py-11">
								<h1 className="text-[2.8rem] text-[#895FF5] font-black font-rubik">
									{(budget.income_amount_monthly * 4.3)?.toFixed(2)} €
								</h1>

								<span className="text-xl text-[#895FF5] font-light font-rubik">
									/month
								</span>
							</div>
						</SwiperSlide>

						<SwiperSlide>
							<div className="flex flex-col gap-y-2 items-center py-11">
								<h1 className="text-[2.8rem] text-[#895FF5] font-black font-rubik">
									{(budget.income_amount_monthly * 12)?.toFixed(2)} €
								</h1>

								<span className="text-xl text-[#895FF5] font-light font-rubik">
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
		</div>
	);
}

export default Budget;
