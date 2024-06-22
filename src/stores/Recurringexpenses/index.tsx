import { createSlice, type Slice } from "@reduxjs/toolkit";
import type { TExtraincome } from "../../types";

export const recurringexpensesStore: Slice = createSlice({
	name: "recurringexpenses",
	initialState: [] as TExtraincome[],
	reducers: {
		setRecurringexpenses: (state, action) => {
			return [...state, ...action.payload];
		},
	},
});

export const { setRecurringexpenses } = recurringexpensesStore.actions;
export default recurringexpensesStore.reducer;
