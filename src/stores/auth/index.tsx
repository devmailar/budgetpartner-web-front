import { setCookie } from "typescript-cookie";
import { type StoreApi, type UseBoundStore, create } from "zustand";

export interface IAuthState {
	value: string;
	setAuthStore: (value: string) => void;
}

const useAuthStore: UseBoundStore<StoreApi<IAuthState>> = create((set) => ({
	value: "",
	setAuthStore: (value: string): void => {
		try {
			setCookie("auth", value, {
				expires: 1,
				sameSite: "strict",
				secure: true,
			});

			set({ value });
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
				throw new Error(error.message);
			}
		}
	},
}));

export default useAuthStore;
