import type { Dispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import EnglishFlag from "../../icons/EnglishFlag";
import { setError } from "../../stores/Error";
import { setLanguage } from "../../stores/Language";
import { setModal } from "../../stores/Modal";
import Modal from "../Modal";

function LanguageModal(): React.ReactNode {
	const dispatch: Dispatch = useDispatch();

	const handleSetLanguage = (language: string): void => {
		try {
			dispatch(setLanguage(language));
			dispatch(
				setModal({
					extraincomeModal: false,
					extraexpenseModal: false,
					incomeModal: false,
					incomeModalEdit: false,
					languageModal: false,
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
		<Modal index={40}>
			<div className="flex flex-col">
				<div className="flex flex-col gap-y-4 px-20 py-8">
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
				</div>
			</div>
		</Modal>
	);
}

export default LanguageModal;
