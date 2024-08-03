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
					className={`${budgetSwitch ? "z-50" : "z-40"} flex gap-x-1 items-center justify-center bg-darker border border-grey px-4 py-2 rounded-3xl`}
					onClick={(): void => setBudgetSwitch(!budgetSwitch)}
				>
					<span className="text-lg text-light font-normal font-rubik">
						{Utils.months[new Date(budget.created_at).getMonth()]} {"("}
						<span className="font-medium">{new Date().getFullYear()}</span>
						{")"}
					</span>

					<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
						<title>Arrow Down</title>
						<path d="M7.5 12.5L15 20L22.5 12.5H7.5Z" stroke="#B7B7B7" strokeWidth="1.5" />
					</svg>
				</button>
			</div>

			{budgetSwitch && (
				<Modal
					index={40}
					classes="gap-y-6 px-2 py-5 absolute top-52 z-50 w-60 rounded-2xl border border-dark animate__animated animate__fadeInDown animate__faster"
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
