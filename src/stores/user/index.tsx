import { type StoreApi, type UseBoundStore, create } from "zustand";
import type { IUser } from "../../types";

export interface IUserState {
	value: IUser;
	setUserStore: (value: IUser) => void;
}

const useUserStore: UseBoundStore<StoreApi<IUserState>> = create((set) => ({
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
}));

export default useUserStore;
