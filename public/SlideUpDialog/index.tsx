import type { Dispatch } from "@reduxjs/toolkit";
import type React from "react";
import { useDispatch } from "react-redux";
import { setModals } from "../../stores/Modals";

interface ISlideUpDialog {
	classes?: string;
	children: React.ReactNode;
}

function SlideUpDialog({ classes, children }: ISlideUpDialog): React.ReactNode {
	const dispatch: Dispatch = useDispatch();

	return (
		<div
			className="z-50 flex items-end absolute top-0 w-full h-full"
			style={{
				backgroundColor: "rgba(24, 24, 24, 0.5)",
			}}
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
				className={`flex flex-col w-full h-[66%] backdrop-blur-[1rem] rounded-t-[2rem] animate__animated animate__fadeInUp animate__faster ${classes}`}
				style={{
					backgroundColor: "rgba(26, 26, 26, 0.7)",
				}}
				onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
					e.stopPropagation();
				}}
				onKeyUp={(): void => {}}
				onKeyDown={(): void => {}}
			>
				{children}
			</div>
		</div>
	);
}

export default SlideUpDialog;
