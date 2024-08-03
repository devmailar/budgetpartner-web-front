import { type PayloadAction, type Slice, createSlice } from "@reduxjs/toolkit";
import { setCookie } from "typescript-cookie";

export const authStore: Slice = createSlice({
	name: "auth",
	initialState: "" as string,
	reducers: {
		setAuth: (_state, action: PayloadAction<string>) => {
			setCookie("Authorization", action.payload, {
				expires: 1,
				sameSite: "strict",
				secure: true,
			});

			return action.payload;
		},
	},
});

export const { setAuth } = authStore.actions;
export default authStore.reducer;
