import { type StoreApi, type UseBoundStore, create } from "zustand";
import { devtools } from "zustand/middleware";

export interface IPopupState {
	value: {
		install: boolean;
	};
	setPopupStore: (value: {
		install: boolean;
	}) => void;
}

const usePopupStore: UseBoundStore<StoreApi<IPopupState>> = create(
	devtools(
		(set) => ({
			value: {
				install: false,
			},
			setPopupStore: (value: {
				install: boolean;
			}): void => {
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
			anonymousActionType: "setPopupStore",
			store: "usePopupStore",
		},
	),
);

export default usePopupStore;
