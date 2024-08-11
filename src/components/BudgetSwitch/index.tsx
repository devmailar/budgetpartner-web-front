import type { Dispatch } from "@reduxjs/toolkit";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { getCookie } from "typescript-cookie";
import { setBudget } from "../../stores/Budget";
import { setError } from "../../stores/Error";
import { setForceLogin } from "../../stores/ForceLogin";
import type { IBudget, IRootState } from "../../types";
import { Utils } from "../../utils";
import Modal from "../Modal";
import { setLoader } from "../../stores/Loader";

function BudgetSwitch(): React.ReactNode {
	const dispatch: Dispatch = useDispatch();
	const navigate: NavigateFunction = useNavigate();

	const budgets: IBudget[] = useSelector((state: IRootState) => state.budgets);
	const budget: IBudget = useSelector((state: IRootState) => state.budget);

	const [budgetSwitch, setBudgetSwitch] = React.useState<boolean>(false);

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
			dispatch(setLoader(true));
			dispatch(setBudget(budget));

			setBudgetSwitch(false);
			setTimeout((): void => {
				dispatch(setLoader(false));
			}, 250);
		} catch (error: unknown) {
			if (error instanceof Error) {
				dispatch(setError(error.message));
			}
		}
	};

	return (
		<>
			<div className="flex flex-col gap-y-2 items-center">
				<button
					type="button"
					className={`${budgetSwitch ? "z-50" : "z-40"} flex gap-x-1.5 items-center justify-center px-2.5 py-2.5 bg-[#160C1F] border border-[#414141] rounded-3xl`}
					onClick={(): void => setBudgetSwitch(!budgetSwitch)}
				>
					<span className="text-base text-[#A0A0A0] font-normal font-rubik">
						{Utils.months[new Date(budget.created_at).getMonth()]} {new Date().getFullYear()}
					</span>

					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<title>Menu</title>
						<path
							d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
							stroke="#A0A0A0"
						/>
						<path
							d="M16 10.5C16 10.5 13.054 13.5 12 13.5C10.9459 13.5 8 10.5 8 10.5"
							stroke="#A0A0A0"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</button>
			</div>

			{budgetSwitch && (
				<Modal
					index={40}
					classes="gap-y-6 px-2 py-4 absolute z-50 top-0 w-60 rounded-2xl border border-dark animate__animated animate__fadeInDown animate__faster"
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
		</>
	);
}

export default BudgetSwitch;
