import { type Slice, createSlice } from "@reduxjs/toolkit";
import type { IModals } from "../../types";

export const modalsStore: Slice = createSlice({
	name: "modals",
	initialState: {} as IModals,
	reducers: {
		setModals: (_state, action) => {
			return action.payload;
		},
	},
});

export const { setModals } = modalsStore.actions;
export default modalsStore.reducer;
