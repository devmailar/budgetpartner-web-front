import type { Dispatch } from "@reduxjs/toolkit";
import type React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBudgetStore } from "../../stores/budget";
import type { IBudget, IRootState } from "../../types";
import { Utils } from "../../utils";

function Switch(): React.ReactNode {
	const dispatch: Dispatch = useDispatch();

	const budgetStore: IBudget = useSelector((state: IRootState) => state.budget);
	const budgetsStore: IBudget[] = useSelector((state: IRootState) => state.budgets);

	return (
		<select
			className="flex items-center gap-1 w-28 px-3 py-2 bg-transparent border-[1.5px] border-[#3F3F46] rounded-2xl text-lg text-[#66666F] font-normal"
			onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => {
				const selectedBudget: IBudget | undefined = budgetsStore.find((budget: IBudget) => {
					return (
						`${new Date(budget.created_at).getMonth()}-${new Date(budget.created_at).getFullYear()}` === e.target.value
					);
				});

				dispatch(setBudgetStore(selectedBudget));
			}}
		>
			{budgetsStore.map((b: IBudget) => (
				<option
					key={b.id}
					selected={b.id === budgetStore.id}
					value={`${new Date(b.created_at).getMonth()}-${new Date(b.created_at).getFullYear()}`}
					className={`text-base ${
						new Date(budgetStore.created_at).getMonth() === new Date(b.created_at).getMonth() &&
						new Date(budgetStore.created_at).getFullYear() === new Date(b.created_at).getFullYear()
							? "text-White"
							: "text-GreyLight"
					} font-rubik`}
				>
					{Utils.monthsList[new Date(b.created_at).getMonth()]} {"-"} {new Date(b.created_at).getFullYear()}
				</option>
			))}
		</select>
	);
}

export default Switch;
