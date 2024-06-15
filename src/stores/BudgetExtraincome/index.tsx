import { createSlice } from "@reduxjs/toolkit";
import type { TBudgetExtraincome } from "../../types";

export const budgetExtraincomeStore = createSlice({
	name: "budgetExtraincome",
	initialState: {} as TBudgetExtraincome,
	reducers: {
		setBudgetExtraincome: (state, action) => {
			return {
				...state,
				...action.payload,
			};
		},
	},
});

export const { setBudgetExtraincome } = budgetExtraincomeStore.actions;
export default budgetExtraincomeStore.reducer;
