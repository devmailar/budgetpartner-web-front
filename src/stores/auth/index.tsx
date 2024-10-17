import { setCookie } from "typescript-cookie";
import { type StoreApi, type UseBoundStore, create } from "zustand";
import { devtools } from "zustand/middleware";

export interface IAuthState {
	value: string;
	setAuthStore: (value: string) => void;
}

const useAuthStore: UseBoundStore<StoreApi<IAuthState>> = create(
	devtools(
		(set) => ({
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
		}),
		{
			enabled: true,
			anonymousActionType: "setAuthStore",
			store: "useAuthStore",
		},
	),
);

export default useAuthStore;
