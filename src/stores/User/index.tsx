import { createSlice } from "@reduxjs/toolkit";
import type { TUser } from "../../types";

export const userStore = createSlice({
	name: "user",
	initialState: {} as TUser,
	reducers: {
		setUser: (state, action) => {
			return {
				...state,
				value: action.payload,
			};
		},
	},
});

export const { setUser } = userStore.actions;
export default userStore.reducer;
