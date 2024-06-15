import { createSlice } from "@reduxjs/toolkit";
import type { TModal } from "../../types";

export const modalStore = createSlice({
	name: "modal",
	initialState: {} as TModal,
	reducers: {
		setModal: (state, action) => {
			return {
				...state,
				...action.payload,
			};
		},
	},
});

export const { setModal } = modalStore.actions;
export default modalStore.reducer;
