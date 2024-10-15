import React, { type ChangeEvent, type ReactNode } from "react";
import useBudgetStore, { type IBudgetState } from "../../stores/budget";
import useBudgetsStore, { type IBudgetsState } from "../../stores/budgets";
import type { IBudget } from "../../types";
import { Utils } from "../../utils";

const Switch = (): ReactNode => {
	const budgetStore: IBudgetState["value"] = useBudgetStore.getState().value;
	const budgetsStore: IBudgetsState["value"] = useBudgetsStore.getState().value;

	const handleChangeBudget = (e: ChangeEvent<HTMLSelectElement>): void => {
		try {
			const selectedBudget: IBudget =
				budgetsStore.find(
					(budget: IBudget) =>
						`${new Date(budget.created_at).getMonth()}-${new Date(budget.created_at).getFullYear()}` === e.target.value,
				) ?? ({} as IBudget);

			const setBudgetStore: IBudgetState["setBudgetStore"] = useBudgetStore.getState().setBudgetStore;
			setBudgetStore(selectedBudget);
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
				throw new Error(error.message);
			}
		}
	};

	return (
		<select
			className="flex items-center gap-1 w-28 px-2.5 py-1.5 bg-transparent border-[1.5px] border-[#3F3F46] rounded-2xl text-lg text-[#66666F] font-normal"
			onChange={handleChangeBudget}
		>
			{budgetsStore.map(
				(budget: IBudget): ReactNode => (
					<option
						key={budget.id}
						selected={budget.id === budgetStore.id}
						value={`${new Date(budget.created_at).getMonth()}-${new Date(budget.created_at).getFullYear()}`}
						className={`text-base ${
							new Date(budgetStore.created_at).getMonth() === new Date(budget.created_at).getMonth() &&
							new Date(budgetStore.created_at).getFullYear() === new Date(budget.created_at).getFullYear()
								? "text-white"
								: "text-[#A0A0A0]"
						} font-rubik`}
					>
						{Utils.monthsList[new Date(budget.created_at).getMonth()]} {"-"} {new Date(budget.created_at).getFullYear()}
					</option>
				),
			)}
		</select>
	);
};

export default Switch;
