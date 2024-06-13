import { createSlice } from "@reduxjs/toolkit";

export const authStore = createSlice({
	name: "auth",
	initialState: { value: {} },
	reducers: {
		setAuth: (state, action) => {
			return {
				...state,
				value: action.payload,
			};
		},
	},
});

export const { setAuth } = authStore.actions;
export default authStore.reducer;
