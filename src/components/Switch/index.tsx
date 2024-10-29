import React, { type ChangeEvent, type ReactNode } from "react";
import useBudgetStore from "../../stores/budget";
import useBudgetsStore from "../../stores/budgets";
import useLoaderStore from "../../stores/loader";
import type { IBudget } from "../../types";
import { Utils } from "../../utils";

const Switch = (): ReactNode => {
	const { value: budget, setBudgetStore } = useBudgetStore();
	const { value: budgets } = useBudgetsStore();
	const { setLoaderStore } = useLoaderStore();

	const handleChangeBudget = (e: ChangeEvent<HTMLSelectElement>): void => {
		try {
			const selectedBudget: IBudget =
				budgets.find(
					(budget: IBudget) =>
						`${new Date(budget.created_at).getMonth()}-${new Date(budget.created_at).getFullYear()}` === e.target.value,
				) ?? ({} as IBudget);

			setLoaderStore(true);
			setBudgetStore(selectedBudget);
			setTimeout((): void => setLoaderStore(false), 500);
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
				throw new Error(error.message);
			}
		}
	};

	return (
		<select
			className="flex items-center gap-x-1 w-40 px-1.5 py-1.5 bg-[#4400DE] text-xs text-white font-medium font-hanson rounded-md"
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
