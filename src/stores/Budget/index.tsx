import { type Slice, createSlice } from "@reduxjs/toolkit";
import type { TBudget } from "../../types";

export const budgetStore: Slice = createSlice({
	name: "budget",
	initialState: {} as TBudget,
	reducers: {
		setBudget: (state, action) => {
			return {
				...state,
				...action.payload,
			};
		},
	},
});

export const { setBudget } = budgetStore.actions;
export default budgetStore.reducer;
