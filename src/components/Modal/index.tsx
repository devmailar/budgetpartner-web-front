import type { Dispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { setModal } from "../../stores/Modal";
import "./index.css";

function Modal({ index, children }: { index: number; children: React.ReactNode }) {
	const dispatch: Dispatch = useDispatch();

	return (
		<div
			className={`absolute z-${index} flex items-start justify-center w-screen h-screen bg-black bg-opacity-20 zoomed-in`}
			onClick={(): void => {
				dispatch(
					setModal({
						extraincomeModal: false,
						extraexpenseModal: false,
						incomeModal: false,
						incomeModalEdit: false,
						languageModal: false,
					}),
				);
			}}
			onKeyUp={(): void => {}}
			onKeyDown={(): void => {}}
		>
			<div
				className="flex flex-col mt-80 bg-darker rounded-2xl"
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
