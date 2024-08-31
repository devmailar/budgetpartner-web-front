import type { Dispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../../stores/Error";
import type { IRootState } from "../../src/types";

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

	setTimeout(async (): Promise<void> => await handleClose(), 3000);

	return (
		<div className="z-50 absolute top-20 flex items-center justify-center w-screen">
			<button
				className="btn px-3.5 py-2.5 border border-red animate__animated animate__fadeInDown animate__faster"
				type="button"
				onClick={(): Promise<void> => handleClose()}
			>
				<div className="flex gap-x-1 items-center">
					<span className="text-sm text-white font-normal font-rubik uppercase">{error}</span>
				</div>
			</button>
		</div>
	);
}

export default ErrorPopup;
