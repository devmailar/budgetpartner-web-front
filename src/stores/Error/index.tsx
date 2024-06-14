import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export const errorStore = createSlice({
	name: "error",
	initialState: {
		errorMessage: "",
	},
	reducers: {
		setError: (state, action: PayloadAction<string>) => {
			return {
				...state,
				errorMessage: action.payload,
			};
		},
	},
});

export const { setError } = errorStore.actions;
export default errorStore.reducer;
