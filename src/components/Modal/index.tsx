import type { Dispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { setModal } from "../../stores/Modal";

function Modal({ index, children }: { index: number; children: React.ReactNode }) {
	const dispatch: Dispatch = useDispatch();

	return (
		<div
			className={`absolute z-${index} flex items-center justify-center w-screen h-screen top-0 bg-black bg-opacity-60`}
			onClick={(): void => {
				dispatch(
					setModal({
						extraincomeModal: false,
						extraexpenseModal: false,
						languageModal: false,
						settingsModal: false,
					}),
				);
			}}
			onKeyUp={(): void => {}}
			onKeyDown={(): void => {}}
		>
			<div
				className="flex flex-col bg-darker rounded-2xl zoom"
				onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
					e.stopPropagation();
				}}
				onKeyUp={() => {}}
				onKeyDown={() => {}}
			>
				{children}
			</div>
		</div>
	);
}

export default Modal;
