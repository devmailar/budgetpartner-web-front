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
			className={`absolute z-${index} flex justify-center w-screen h-screen left-0 top-0 px-3 bg-[#080808] bg-opacity-20`}
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
				className={`flex flex-col bg-[#000000] mt-72 w-fit h-fit rounded-3xl ${classes}`}
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
