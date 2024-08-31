import { type PayloadAction, type Slice, createSlice } from "@reduxjs/toolkit";
import type { IBudget } from "../../types";

export const budgetsStore: Slice = createSlice({
	name: "budgets",
	initialState: [] as IBudget[],
	reducers: {
		setBudgetsStore: (_state, action: PayloadAction<IBudget[]>) => {
			return action.payload;
		},
	},
});

export const { setBudgetsStore } = budgetsStore.actions;
export default budgetsStore.reducer;
