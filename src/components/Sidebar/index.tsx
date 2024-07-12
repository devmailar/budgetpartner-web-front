import type { Dispatch } from "@reduxjs/toolkit";
import type React from "react";
import { useDispatch, useSelector } from "react-redux";
import EnglishFlag from "../../icons/EnglishFlag";
import FinnishFlag from "../../icons/FinnishFlag";
import { setError } from "../../stores/Error";
import { setModal } from "../../stores/Modal";
import type { IRootState } from "../../types";

function Sidebar(): React.ReactNode {
	const dispatch: Dispatch = useDispatch();

	const language: string = useSelector((state: IRootState) => state.language);

	const handleOpenLanguageModal = (): void => {
		try {
			dispatch(
				setModal({
					extraincomeModal: false,
					extraexpenseModal: false,
					incomeModal: false,
					incomeModalEdit: false,
					languageModal: true,
				}),
			);
		} catch (error: unknown) {
			if (error instanceof Error) {
				dispatch(setError(error.message));
			}
		}
	};

	return (
		<div className="absolute px-4 py-4 bg-black border-r border-r-grey h-screen">
			<div className="flex flex-col items-center justify-between h-full">
				<div className="flex flex-col gap-y-20 items-center">
					<span className="text-4xl text-purple font-black font-rubik">BP</span>

					<div className="flex flex-col">
						<button type="button" className="flex items-center justify-center p-3">
							<svg xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 40 40" fill="none">
								<title>Home</title>
								<g clipPath="url(#clip0_103_77)">
									<path
										d="M21.1784 3.82147L36.1784 18.8215C37.2284 19.8715 36.485 21.6665 35 21.6665H33.3334V31.6665C33.3334 32.9926 32.8066 34.2643 31.8689 35.202C30.9312 36.1397 29.6594 36.6665 28.3334 36.6665H26.6667V24.9998C26.6668 23.7245 26.1795 22.4973 25.3046 21.5694C24.4296 20.6415 23.2332 20.083 21.96 20.0081L21.6667 19.9998H18.3334C17.0073 19.9998 15.7355 20.5266 14.7978 21.4643C13.8601 22.402 13.3334 23.6737 13.3334 24.9998V36.6665H11.6667C10.3406 36.6665 9.06884 36.1397 8.13116 35.202C7.19348 34.2643 6.66669 32.9926 6.66669 31.6665V21.6665H5.00002C3.51669 21.6665 2.77169 19.8715 3.82169 18.8215L18.8217 3.82147C19.1342 3.50902 19.5581 3.3335 20 3.3335C20.442 3.3335 20.8658 3.50902 21.1784 3.82147ZM21.6667 23.3331C22.1087 23.3331 22.5326 23.5087 22.8452 23.8213C23.1578 24.1339 23.3334 24.5578 23.3334 24.9998V36.6665H16.6667V24.9998C16.6667 24.5916 16.8166 24.1976 17.0879 23.8925C17.3591 23.5875 17.7329 23.3926 18.1384 23.3448L18.3334 23.3331H21.6667Z"
										fill="white"
									/>
								</g>
								<defs>
									<clipPath id="clip0_103_77">
										<rect width="40" height="40" fill="white" />
									</clipPath>
								</defs>
							</svg>
						</button>

						<button type="button" className="flex items-center justify-center p-3">
							<svg xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 40 40" fill="none">
								<title>Sticky</title>
								<g clipPath="url(#clip0_103_84)">
									<path
										d="M9.99996 6.6665H30C30.884 6.6665 31.7319 7.01769 32.357 7.64281C32.9821 8.26794 33.3333 9.11578 33.3333 9.99984V21.6665H25C24.1159 21.6665 23.2681 22.0177 22.6429 22.6428C22.0178 23.2679 21.6666 24.1158 21.6666 24.9998V33.3332H9.99996C9.1159 33.3332 8.26806 32.982 7.64294 32.3569C7.01782 31.7317 6.66663 30.8839 6.66663 29.9998V9.99984C6.66663 9.11578 7.01782 8.26794 7.64294 7.64281C8.26806 7.01769 9.1159 6.6665 9.99996 6.6665Z"
										stroke="white"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M33.3333 21.6665V21.9532C33.3331 22.8372 32.9818 23.6849 32.3566 24.3098L24.31 32.3565C23.685 32.9817 22.8373 33.333 21.9533 33.3332H21.6666"
										stroke="white"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</g>
								<defs>
									<clipPath id="clip0_103_84">
										<rect width="40" height="40" fill="white" />
									</clipPath>
								</defs>
							</svg>
						</button>

						<button type="button" className="flex items-center justify-center p-3">
							<svg xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 40 40" fill="none">
								<title>Calculator</title>
								<g clipPath="url(#clip0_103_88)">
									<path
										d="M6.66663 8.33333C6.66663 7.44928 7.01782 6.60143 7.64294 5.97631C8.26806 5.35119 9.1159 5 9.99996 5H30C30.884 5 31.7319 5.35119 32.357 5.97631C32.9821 6.60143 33.3333 7.44928 33.3333 8.33333V31.6667C33.3333 32.5507 32.9821 33.3986 32.357 34.0237C31.7319 34.6488 30.884 35 30 35H9.99996C9.1159 35 8.26806 34.6488 7.64294 34.0237C7.01782 33.3986 6.66663 32.5507 6.66663 31.6667V8.33333Z"
										stroke="white"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M13.3334 13.3332C13.3334 12.8911 13.509 12.4672 13.8215 12.1547C14.1341 11.8421 14.558 11.6665 15 11.6665H25C25.4421 11.6665 25.866 11.8421 26.1786 12.1547C26.4911 12.4672 26.6667 12.8911 26.6667 13.3332V14.9998C26.6667 15.4419 26.4911 15.8658 26.1786 16.1783C25.866 16.4909 25.4421 16.6665 25 16.6665H15C14.558 16.6665 14.1341 16.4909 13.8215 16.1783C13.509 15.8658 13.3334 15.4419 13.3334 14.9998V13.3332Z"
										stroke="white"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M13.3334 23.3335V23.3502"
										stroke="white"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M20 23.3335V23.3502"
										stroke="white"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M26.6666 23.3335V23.3502"
										stroke="white"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M13.3334 28.3335V28.3502"
										stroke="white"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M20 28.3335V28.3502"
										stroke="white"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M26.6666 28.3335V28.3502"
										stroke="white"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</g>
								<defs>
									<clipPath id="clip0_103_88">
										<rect width="40" height="40" fill="white" />
									</clipPath>
								</defs>
							</svg>
						</button>

						<button type="button" className="flex items-center justify-center p-3">
							<svg xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 40 40" fill="none">
								<title>Info</title>
								<g clip-path="url(#clip0_116_8)">
									<path
										d="M5 20C5 21.9698 5.38799 23.9204 6.14181 25.7403C6.89563 27.5601 8.00052 29.2137 9.3934 30.6066C10.7863 31.9995 12.4399 33.1044 14.2597 33.8582C16.0796 34.612 18.0302 35 20 35C21.9698 35 23.9204 34.612 25.7403 33.8582C27.5601 33.1044 29.2137 31.9995 30.6066 30.6066C31.9995 29.2137 33.1044 27.5601 33.8582 25.7403C34.612 23.9204 35 21.9698 35 20C35 18.0302 34.612 16.0796 33.8582 14.2597C33.1044 12.4399 31.9995 10.7863 30.6066 9.3934C29.2137 8.00052 27.5601 6.89563 25.7403 6.14181C23.9204 5.38799 21.9698 5 20 5C18.0302 5 16.0796 5.38799 14.2597 6.14181C12.4399 6.89563 10.7863 8.00052 9.3934 9.3934C8.00052 10.7863 6.89563 12.4399 6.14181 14.2597C5.38799 16.0796 5 18.0302 5 20Z"
										stroke="#FEFEFE"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M20 28.3335V28.3502"
										stroke="#FEFEFE"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M20 22.5C19.9693 21.9589 20.1152 21.4225 20.4158 20.9716C20.7164 20.5207 21.1554 20.1797 21.6666 20C22.2931 19.7604 22.8554 19.3787 23.3092 18.8849C23.7631 18.3911 24.0962 17.7987 24.2822 17.1543C24.4682 16.5099 24.5021 15.8311 24.3812 15.1714C24.2603 14.5117 23.9879 13.889 23.5855 13.3525C23.1831 12.8159 22.6616 12.3801 22.0621 12.0793C21.4626 11.7785 20.8015 11.621 20.1308 11.6192C19.4601 11.6173 18.7982 11.7711 18.197 12.0686C17.5959 12.366 17.072 12.799 16.6666 13.3333"
										stroke="#FEFEFE"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</g>
								<defs>
									<clipPath id="clip0_116_8">
										<rect width="40" height="40" fill="white" />
									</clipPath>
								</defs>
							</svg>
						</button>
					</div>
				</div>

				<div className="flex flex-col gap-y-4">
					<button
						type="button"
						className="flex items-center justify-center p-3"
						onClick={(): void => handleOpenLanguageModal()}
					>
						{language === "fi" ? <FinnishFlag className="w-10 h-10" /> : <EnglishFlag className="w-10 h-10" />}
					</button>
				</div>
			</div>
		</div>
	);
}

export default Sidebar;
