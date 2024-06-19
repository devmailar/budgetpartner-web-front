import type { Dispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { setModal } from "../../stores/Modal";

function Modal({
	index,
	children,
}: { index: number; children: React.ReactNode }) {
	const dispatch: Dispatch = useDispatch();

	return (
		<div
			className={`absolute z-${index} flex items-start justify-center w-screen h-screen bg-black bg-opacity-40 backdrop-blur-sm`}
			onClick={(): void => {
				dispatch(
					setModal({
						extraincomeModal: false,
						recurringexpensesModal: false,
						incomeModalEdit: false,
					}),
				);
			}}
			onKeyUp={(): void => {}}
			onKeyDown={(): void => {}}
		>
			<div
				className="flex flex-col mt-80 bg-[#1A1A1A] border border-[#202020] shadow-sm shadow-black rounded-2xl"
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
