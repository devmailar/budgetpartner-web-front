import { type StoreApi, type UseBoundStore, create } from "zustand";
import { devtools } from "zustand/middleware";

export interface ILoaderState {
	value: boolean;
	setLoaderStore: (value: boolean) => void;
}

const useLoaderStore: UseBoundStore<StoreApi<ILoaderState>> = create(
	devtools(
		(set) => ({
			value: false,
			setLoaderStore: (value: boolean): void => {
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
			anonymousActionType: "setLoaderStore",
			store: "useLoaderStore",
		},
	),
);

export default useLoaderStore;
