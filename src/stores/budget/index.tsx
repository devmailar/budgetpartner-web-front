import { type PayloadAction, type Slice, createSlice } from "@reduxjs/toolkit";
import type { IBudget } from "../../types";

export const budgetStore: Slice = createSlice({
	name: "budget",
	initialState: {} as IBudget,
	reducers: {
		setBudgetStore: (_state: unknown, action: PayloadAction<IBudget>) => {
			try {
				const payload: string = JSON.stringify(action.payload);
				const budget: IBudget = JSON.parse(payload);

				if (Object.keys(budget).length === 0) {
					return action.payload;
				}

				const budgetDateISO: string = new Date(budget.created_at).toISOString();

				localStorage.setItem("budget", budgetDateISO);

				return action.payload;
			} catch (error: unknown) {
				if (error instanceof Error) {
					alert(error.message);
				}
			}
		},
	},
});

export const { setBudgetStore } = budgetStore.actions;
export default budgetStore.reducer;
