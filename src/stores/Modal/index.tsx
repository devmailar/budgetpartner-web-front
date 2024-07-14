import { type Slice, createSlice } from "@reduxjs/toolkit";
import type { TModal } from "../../types";

export const modalStore: Slice = createSlice({
	name: "modal",
	initialState: {} as TModal,
	reducers: {
		setModal: (_state, action) => {
			return action.payload;
		},
	},
});

export const { setModal } = modalStore.actions;
export default modalStore.reducer;
