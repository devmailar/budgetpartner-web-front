import { type Slice, createSlice } from "@reduxjs/toolkit";
import type { IBudget } from "../../types";

export const budgetStore: Slice = createSlice({
	name: "budget",
	initialState: {} as IBudget,
	reducers: {
		setBudget: (_state, action) => {
			const payload: string = JSON.stringify(action.payload);
			const budget: IBudget = JSON.parse(payload);
			const budgetDateISO: string = new Date(budget.created_at).toISOString();

			localStorage.setItem("budget", budgetDateISO);

			return action.payload;
		},
	},
});

export const { setBudget } = budgetStore.actions;
export default budgetStore.reducer;
