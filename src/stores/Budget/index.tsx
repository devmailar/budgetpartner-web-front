import { type Slice, createSlice } from "@reduxjs/toolkit";
import type { TBudget } from "../../types";

export const budgetStore: Slice = createSlice({
	name: "budget",
	initialState: {} as TBudget,
	reducers: {
		setBudget: (_state, action) => {
			const payload: string = JSON.stringify(action.payload);
			const budget: TBudget = JSON.parse(payload);
			const budgetDateISO: string = new Date(budget.created_at).toISOString();

			localStorage.setItem("budget", budgetDateISO);

			return action.payload;
		},
	},
});

export const { setBudget } = budgetStore.actions;
export default budgetStore.reducer;
