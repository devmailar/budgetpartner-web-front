import { type StoreApi, type UseBoundStore, create } from "zustand";
import type { IBudget } from "../../types";

export interface IBudgetsState {
	value: IBudget[];
	setBudgetsStore: (value: IBudget[]) => void;
}

const useBudgetsStore: UseBoundStore<StoreApi<IBudgetsState>> = create((set) => ({
	value: [],
	setBudgetsStore: (value: IBudget[]): void => {
		try {
			set({ value });
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
				throw new Error(error.message);
			}
		}
	},
}));

export default useBudgetsStore;
