import { type Slice, createSlice } from "@reduxjs/toolkit";
import type { IUser } from "../../types";

export const userStore: Slice = createSlice({
	name: "user",
	initialState: {} as IUser,
	reducers: {
		setUser: (_state, action) => {
			return action.payload;
		},
	},
});

export const { setUser } = userStore.actions;
export default userStore.reducer;
