import { type PayloadAction, type Slice, createSlice } from "@reduxjs/toolkit";
import type { IDialog } from "../../types";

export const dialogStore: Slice = createSlice({
	name: "dialog",
	initialState: { extraincomes: false, extraexpenses: false } as IDialog,
	reducers: {
		setDialogStore: (_state, action: PayloadAction<IDialog>) => {
			return action.payload;
		},
	},
});

export const { setDialogStore } = dialogStore.actions;
export default dialogStore.reducer;
