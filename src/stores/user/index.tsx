import { type PayloadAction, type Slice, createSlice } from "@reduxjs/toolkit";
import type { IUser } from "../../types";

export const userStore: Slice = createSlice({
	name: "user",
	initialState: {} as IUser,
	reducers: {
		setUserStore: (_state, action: PayloadAction<IUser>) => {
			return action.payload;
		},
	},
});

export const { setUserStore } = userStore.actions;
export default userStore.reducer;
