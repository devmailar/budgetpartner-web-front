import type { Dispatch } from "@reduxjs/toolkit";
import type React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../../stores/Error";
import type { IRootState } from "../../types";
import Modal from "../Modal";

function ErrorPopup(): React.ReactNode {
	const dispatch: Dispatch = useDispatch();
	const error: string = useSelector((state: IRootState) => state.error);

	const handleClose = async (): Promise<void> => {
		try {
			dispatch(setError(""));
		} catch (error: unknown) {
			if (error instanceof Error) {
				dispatch(setError(error.message));
			}
		}
	};

	return (
		<Modal index={50}>
			<div className="px-4 py-4">
				<span className="text-sm text-white font-normal font-rubik">{error}</span>
			</div>

			<button type="button" className="btn border-t border-t-dark py-2.5" onClick={(): Promise<void> => handleClose()}>
				<span className="text-sm text-purple font-normal font-rubik">Close</span>
			</button>
		</Modal>
	);
}

export default ErrorPopup;
