import type { Dispatch } from "@reduxjs/toolkit";
import type React from "react";
import { useDispatch } from "react-redux";
import { setModals } from "../../stores/Modals";

interface IModalProps {
	index: number;
	classes?: string;
	children: React.ReactNode;
}

function Modal({ index, classes, children }: IModalProps): React.ReactNode {
	const dispatch: Dispatch = useDispatch();

	return (
		<div
			className={`absolute z-${index} flex items-center justify-center w-screen h-screen top-0 bg-black bg-opacity-60`}
			onClick={(): void => {
				dispatch(
					setModals({
						extraincome: false,
						extraexpense: false,
						language: false,
						settings: false,
					}),
				);
			}}
			onKeyUp={(): void => {}}
			onKeyDown={(): void => {}}
		>
			<div
				className={`flex flex-col bg-darker rounded-2xl ${classes}`}
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
