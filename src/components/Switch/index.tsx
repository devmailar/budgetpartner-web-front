import React, { type ChangeEvent, type ReactNode } from "react";
import useBudgetStore from "../../stores/budget";
import useBudgetsStore from "../../stores/budgets";
import type { IBudget } from "../../types";
import { Utils } from "../../utils";

const Switch = (): ReactNode => {
	const { value: budget, setBudgetStore } = useBudgetStore();
	const { value: budgets } = useBudgetsStore();

	const handleChangeBudget = (e: ChangeEvent<HTMLSelectElement>): void => {
		try {
			const selectedBudget: IBudget =
				budgets.find(
					(budget: IBudget) =>
						`${new Date(budget.created_at).getMonth()}-${new Date(budget.created_at).getFullYear()}` === e.target.value,
				) ?? ({} as IBudget);

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
			className="flex items-center gap-x-1 w-20 px-3 py-1.5 bg-[#212121] text-sm text-[#525252] font-medium rounded-full"
			value={`${new Date(budget.created_at).getMonth()}-${new Date(budget.created_at).getFullYear()}`}
			onChange={handleChangeBudget}
		>
			{budgets.map(
				(b: IBudget): ReactNode => (
					<option
						key={b.id}
						value={`${new Date(b.created_at).getMonth()}-${new Date(b.created_at).getFullYear()}`}
						className={`text-base ${
							new Date(budget.created_at).getMonth() === new Date(b.created_at).getMonth() &&
							new Date(budget.created_at).getFullYear() === new Date(b.created_at).getFullYear()
								? "text-white"
								: "text-[#A0A0A0]"
						} font-rubik`}
					>
						{Utils.monthsList[new Date(b.created_at).getMonth()]} {"-"} {new Date(b.created_at).getFullYear()}
					</option>
				),
			)}
		</select>
	);
};

export default Switch;
