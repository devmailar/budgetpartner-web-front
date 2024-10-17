import { type StoreApi, type UseBoundStore, create } from "zustand";
import { devtools } from "zustand/middleware";
import type { IUser } from "../../types";

export interface IUserState {
	value: IUser;
	setUserStore: (value: IUser) => void;
}

const useUserStore: UseBoundStore<StoreApi<IUserState>> = create(
	devtools(
		(set) => ({
			value: {} as IUser,
			setUserStore: (value: IUser): void => {
				try {
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
			anonymousActionType: "setUserStore",
			store: "useUserStore",
		},
	),
);
export default useUserStore;
