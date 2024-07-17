import { type Slice, createSlice } from "@reduxjs/toolkit";
import type { IBudget } from "../../types";

export const budgetsStore: Slice = createSlice({
	name: "budgets",
	initialState: [] as IBudget[],
	reducers: {
		setBudgets: (_state, action) => {
			return action.payload;
		},
	},
});

export const { setBudgets } = budgetsStore.actions;
export default budgetsStore.reducer;
