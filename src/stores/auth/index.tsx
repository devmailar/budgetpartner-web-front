import { type PayloadAction, type Slice, createSlice } from "@reduxjs/toolkit";
import { setCookie } from "typescript-cookie";

export const authStore: Slice = createSlice({
	name: "auth",
	initialState: "" as string,
	reducers: {
		setAuthStore: (_state: unknown, action: PayloadAction<string>) => {
			setCookie("auth", action.payload, {
				expires: 1,
				sameSite: "strict",
				secure: true,
			});

			return action.payload;
		},
	},
});

export const { setAuthStore } = authStore.actions;
export default authStore.reducer;
