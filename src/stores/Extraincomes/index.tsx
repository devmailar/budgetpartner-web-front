import { type Slice, createSlice } from "@reduxjs/toolkit";
import type { TExtraincome } from "../../types";

export const extraincomesStore: Slice = createSlice({
	name: "extraincomes",
	initialState: [] as TExtraincome[],
	reducers: {
		setExtraincomes: (state, action) => {
			return [...state, ...action.payload];
		},
	},
});

export const { setExtraincomes } = extraincomesStore.actions;
export default extraincomesStore.reducer;
