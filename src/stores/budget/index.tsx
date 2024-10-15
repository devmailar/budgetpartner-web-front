import { type StoreApi, type UseBoundStore, create } from "zustand";
import type { IBudget } from "../../types";

export interface IBudgetState {
	value: IBudget;
	setBudgetStore: (value: IBudget) => void;
}

const useBudgetStore: UseBoundStore<StoreApi<IBudgetState>> = create((set) => ({
	value: {} as IBudget,
	setBudgetStore: (value: IBudget): void => {
		try {
			const budget: IBudget = value;
			if (Object.keys(budget).length === 0) {
				return;
			}

			const budgetDateISO = new Date(budget.created_at).toISOString();
			localStorage.setItem("budget", budgetDateISO);
			set({ value });
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
				throw new Error(error.message);
			}
		}
	},
}));

export default useBudgetStore;
