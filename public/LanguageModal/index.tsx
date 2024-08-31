import type { Dispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import EnglishFlag from "../../assets/icons/EnglishFlag";
import { setError } from "../../stores/Error";
import { setLanguage } from "../../stores/Language";
import { setModals } from "../../stores/Modals";
import Modal from "../Modal";

function LanguageModal(): React.ReactNode {
	const dispatch: Dispatch = useDispatch();

	const handleSetLanguage = (language: string): void => {
		try {
			dispatch(setLanguage(language));
			dispatch(
				setModals({
					extraincome: false,
					extraexpense: false,
					language: false,
					settings: false,
				}),
			);

			// TODO: Save specified languagge to local-storage or database
		} catch (error: unknown) {
			if (error instanceof Error) {
				dispatch(setError(error.message));
			}
		}
	};

	return (
		<Modal index={40} classes="gap-y-4 px-6 py-6 w-80 animate__animated animate__fadeInDown animate__faster">
			<span className="text-base text-white font-medium font-rubik">Language</span>

			<button
				type="button"
				className="flex gap-x-4 items-center border border-light px-4 py-4 rounded-2xl"
				onClick={(): void => handleSetLanguage("en")}
			>
				<EnglishFlag className="w-10 h-10" />
				<span className="text-lg text-white font-light font-rubik">English</span>
			</button>
			{/* 
					<button
						type="button"
						className="flex gap-x-4 items-center border border-light px-4 py-4 rounded-2xl"
						onClick={(): void => handleSetLanguage("fi")}
					>
						<FinnishFlag className="w-10 h-10" />
						<span className="text-lg text-white font-light font-rubik">Finnish</span>
					</button> */}
		</Modal>
	);
}

export default LanguageModal;
