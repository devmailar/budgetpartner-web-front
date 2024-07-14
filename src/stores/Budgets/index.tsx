import { type Slice, createSlice } from "@reduxjs/toolkit";
import type { TBudget } from "../../types";

export const budgetsStore: Slice = createSlice({
	name: "budgets",
	initialState: [] as TBudget[],
	reducers: {
		setBudgets: (_state, action) => {
			return action.payload;
		},
	},
});

export const { setBudgets } = budgetsStore.actions;
export default budgetsStore.reducer;
