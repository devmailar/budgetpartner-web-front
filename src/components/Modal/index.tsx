import type { Dispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { setModal } from "../../stores/Modal";
import "./index.css";

function Modal({ index, children }: { index: number; children: React.ReactNode }) {
	const dispatch: Dispatch = useDispatch();

	return (
		<div
			className={`absolute z-${index} flex items-center justify-center w-screen h-full top-0 bg-black bg-opacity-20`}
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
				className="flex flex-col bg-darker rounded-2xl zoomed-in"
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
