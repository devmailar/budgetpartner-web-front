import type { Dispatch } from "@reduxjs/toolkit";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { removeCookie } from "typescript-cookie";
import { setError } from "../../stores/Error";
import { setModals } from "../../stores/Modals";
import type { IRootState, IUser } from "../../types";
import Modal from "../Modal";

function SettingsModal(): React.ReactNode {
	const dispatch: Dispatch = useDispatch();
	const navigate: NavigateFunction = useNavigate();

	const user: IUser = useSelector((state: IRootState) => state.user);

	const [hideEmail, setHideEmail] = useState<boolean>(false);

	const handleClose = (): void => {
		try {
			dispatch(
				setModals({
					extraincome: false,
					extraexpense: false,
					language: false,
					settings: false,
				}),
			);
		} catch (error: unknown) {
			if (error instanceof Error) {
				dispatch(setError(error.message));
			}
		}
	};

	const handleLogout = (): void => {
		try {
			removeCookie("Authorization");
			navigate("/login");
			window.location.reload();
		} catch (error: unknown) {
			if (error instanceof Error) {
				dispatch(setError(error.message));
			}
		}
	};

	return (
		<Modal index={40} classes="gap-y-2 px-6 py-6 w-[28rem] animate__animated animate__fadeInDown animate__faster">
			<div className="flex items-center justify-between">
				<span className="text-base text-white font-medium font-rubik">Settings</span>

				<button type="button" onClick={(): void => handleClose()}>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
						<title>Close</title>
						<g clipPath="url(#clip0_245_208)">
							<path d="M15 5L5 15" stroke="#4B4B4B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
							<path d="M5 5L15 15" stroke="#4B4B4B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
						</g>
						<defs>
							<clipPath id="clip0_245_208">
								<rect width="20" height="20" fill="white" />
							</clipPath>
						</defs>
					</svg>
				</button>
			</div>

			<div className="flex gap-x-4 items-center pt-2 border-t border-t-dark">
				<div className="flex flex-col gap-y-6 pr-4 border-r border-r-dark">
					<div className="flex flex-col gap-y-3">
						<button type="button" className="flex gap-x-2 items-center w-fit">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 40 40" fill="none">
								<title>Settings</title>
								<g clip-path="url(#clip0_279_157)">
									<path
										d="M17.2083 7.195C17.9183 4.26833 22.0817 4.26833 22.7917 7.195C22.8982 7.63467 23.107 8.04296 23.4012 8.38667C23.6953 8.73037 24.0665 8.99976 24.4844 9.17291C24.9024 9.34606 25.3553 9.41808 25.8063 9.38311C26.2573 9.34814 26.6937 9.20717 27.08 8.97167C29.6517 7.405 32.5967 10.3483 31.03 12.9217C30.7948 13.3078 30.6541 13.7439 30.6192 14.1946C30.5843 14.6453 30.6563 15.0979 30.8292 15.5156C31.0022 15.9333 31.2712 16.3043 31.6145 16.5984C31.9579 16.8925 32.3657 17.1015 32.805 17.2083C35.7317 17.9183 35.7317 22.0817 32.805 22.7917C32.3653 22.8982 31.957 23.107 31.6133 23.4012C31.2696 23.6953 31.0002 24.0665 30.8271 24.4844C30.6539 24.9024 30.5819 25.3553 30.6169 25.8063C30.6519 26.2573 30.7928 26.6937 31.0283 27.08C32.595 29.6517 29.6517 32.5967 27.0783 31.03C26.6922 30.7948 26.2561 30.6541 25.8054 30.6192C25.3547 30.5843 24.9021 30.6563 24.4844 30.8292C24.0667 31.0022 23.6957 31.2712 23.4016 31.6145C23.1075 31.9579 22.8985 32.3657 22.7917 32.805C22.0817 35.7317 17.9183 35.7317 17.2083 32.805C17.1018 32.3653 16.893 31.957 16.5988 31.6133C16.3047 31.2696 15.9335 31.0002 15.5156 30.8271C15.0976 30.6539 14.6447 30.5819 14.1937 30.6169C13.7427 30.6519 13.3063 30.7928 12.92 31.0283C10.3483 32.595 7.40333 29.6517 8.97 27.0783C9.20517 26.6922 9.34592 26.2561 9.38081 25.8054C9.41569 25.3547 9.34374 24.9021 9.17079 24.4844C8.99783 24.0667 8.72877 23.6957 8.38545 23.4016C8.04214 23.1075 7.63427 22.8985 7.195 22.7917C4.26833 22.0817 4.26833 17.9183 7.195 17.2083C7.63467 17.1018 8.04296 16.893 8.38667 16.5988C8.73037 16.3047 8.99976 15.9335 9.17291 15.5156C9.34606 15.0976 9.41808 14.6447 9.38311 14.1937C9.34814 13.7427 9.20717 13.3063 8.97167 12.92C7.405 10.3483 10.3483 7.40333 12.9217 8.97C14.5883 9.98333 16.7483 9.08667 17.2083 7.195Z"
										stroke="#FEFEFE"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M15 20C15 21.3261 15.5268 22.5979 16.4645 23.5355C17.4021 24.4732 18.6739 25 20 25C21.3261 25 22.5979 24.4732 23.5355 23.5355C24.4732 22.5979 25 21.3261 25 20C25 18.6739 24.4732 17.4021 23.5355 16.4645C22.5979 15.5268 21.3261 15 20 15C18.6739 15 17.4021 15.5268 16.4645 16.4645C15.5268 17.4021 15 18.6739 15 20Z"
										stroke="#FEFEFE"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</g>
								<defs>
									<clipPath id="clip0_279_157">
										<rect width="40" height="40" fill="white" />
									</clipPath>
								</defs>
							</svg>

							<span className="text-sm text-white font-normal font-rubik">Account</span>
						</button>

						<button type="button" className="flex gap-x-2 items-center w-fit">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
								<title>Language</title>
								<g clip-path="url(#clip0_280_249)">
									<path d="M4 5H11" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									<path
										d="M9 3V5C9 9.418 6.761 13 4 13"
										stroke="white"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M5 9C5 11.144 7.952 12.908 11.7 13"
										stroke="white"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M12 20L16 11L20 20"
										stroke="white"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M19.1 18H12.9"
										stroke="white"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</g>
								<defs>
									<clipPath id="clip0_280_249">
										<rect width="24" height="24" fill="white" />
									</clipPath>
								</defs>
							</svg>

							<span className="text-sm text-white font-normal font-rubik">Language</span>
						</button>

						<button type="button" className="flex gap-x-2 items-center w-fit">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
								<title>Appearance</title>
								<g clip-path="url(#clip0_282_256)">
									<path
										d="M12 21C9.61305 21 7.32387 20.0518 5.63604 18.364C3.94821 16.6761 3 14.3869 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C16.97 3 21 6.582 21 11C21 12.06 20.526 13.078 19.682 13.828C18.838 14.578 17.693 15 16.5 15H14C13.5539 14.9928 13.1181 15.135 12.7621 15.404C12.4061 15.673 12.1503 16.0533 12.0353 16.4844C11.9203 16.9155 11.9528 17.3727 12.1276 17.7833C12.3025 18.1938 12.6095 18.5341 13 18.75C13.1997 18.9342 13.3366 19.1764 13.3915 19.4425C13.4465 19.7085 13.4167 19.9851 13.3064 20.2334C13.196 20.4816 13.0107 20.6891 12.7764 20.8266C12.5421 20.9641 12.2705 21.0247 12 21Z"
										stroke="white"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M7.5 10.5C7.5 10.7652 7.60536 11.0196 7.79289 11.2071C7.98043 11.3946 8.23478 11.5 8.5 11.5C8.76522 11.5 9.01957 11.3946 9.20711 11.2071C9.39464 11.0196 9.5 10.7652 9.5 10.5C9.5 10.2348 9.39464 9.98043 9.20711 9.79289C9.01957 9.60536 8.76522 9.5 8.5 9.5C8.23478 9.5 7.98043 9.60536 7.79289 9.79289C7.60536 9.98043 7.5 10.2348 7.5 10.5Z"
										stroke="white"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M11.5 7.5C11.5 7.76522 11.6054 8.01957 11.7929 8.20711C11.9804 8.39464 12.2348 8.5 12.5 8.5C12.7652 8.5 13.0196 8.39464 13.2071 8.20711C13.3946 8.01957 13.5 7.76522 13.5 7.5C13.5 7.23478 13.3946 6.98043 13.2071 6.79289C13.0196 6.60536 12.7652 6.5 12.5 6.5C12.2348 6.5 11.9804 6.60536 11.7929 6.79289C11.6054 6.98043 11.5 7.23478 11.5 7.5Z"
										stroke="white"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M15.5 10.5C15.5 10.7652 15.6054 11.0196 15.7929 11.2071C15.9804 11.3946 16.2348 11.5 16.5 11.5C16.7652 11.5 17.0196 11.3946 17.2071 11.2071C17.3946 11.0196 17.5 10.7652 17.5 10.5C17.5 10.2348 17.3946 9.98043 17.2071 9.79289C17.0196 9.60536 16.7652 9.5 16.5 9.5C16.2348 9.5 15.9804 9.60536 15.7929 9.79289C15.6054 9.98043 15.5 10.2348 15.5 10.5Z"
										stroke="white"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</g>
								<defs>
									<clipPath id="clip0_282_256">
										<rect width="24" height="24" fill="white" />
									</clipPath>
								</defs>
							</svg>

							<span className="text-sm text-white font-normal font-rubik">Appearance</span>
						</button>

						<button type="button" className="flex gap-x-2 items-center w-fit">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
								<title>Support</title>
								<g clip-path="url(#clip0_283_273)">
									<path
										d="M5 4.9996C5.93464 4.08346 7.19124 3.57031 8.5 3.57031C9.80876 3.57031 11.0654 4.08346 12 4.9996C12.9346 5.91573 14.1912 6.42888 15.5 6.42888C16.8088 6.42888 18.0654 5.91573 19 4.9996V13.9996C18.0654 14.9157 16.8088 15.4289 15.5 15.4289C14.1912 15.4289 12.9346 14.9157 12 13.9996C11.0654 13.0835 9.80876 12.5703 8.5 12.5703C7.19124 12.5703 5.93464 13.0835 5 13.9996V4.9996Z"
										stroke="white"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path d="M5 21V14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
								</g>
								<defs>
									<clipPath id="clip0_283_273">
										<rect width="24" height="24" fill="white" />
									</clipPath>
								</defs>
							</svg>

							<span className="text-sm text-white font-normal font-rubik">Support</span>
						</button>

						<button type="button" className="flex gap-x-2 items-center w-fit" onClick={(): void => handleLogout()}>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
								<title>Logout</title>
								<path
									d="M7.02301 5.5C5.4122 6.56898 4.18841 8.12823 3.53281 9.94691C2.87722 11.7656 2.82467 13.7471 3.38294 15.5979C3.94121 17.4488 5.08063 19.0707 6.63252 20.2236C8.18441 21.3765 10.0663 21.999 11.9995 21.999C13.9328 21.999 15.8146 21.3765 17.3665 20.2236C18.9184 19.0707 20.0578 17.4488 20.6161 15.5979C21.1744 13.7471 21.1218 11.7656 20.4662 9.94691C19.8106 8.12823 18.5868 6.56898 16.976 5.5M12 2V10"
									stroke="white"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>

							<span className="text-sm text-white font-normal font-rubik">Logout</span>
						</button>
					</div>
				</div>

				<div className="flex flex-col gap-y-8">
					<div className="flex flex-col gap-y-2">
						<div className="flex flex-col gap-y-1">
							<span className="text-sm text-white font-normal font-rubik">Email</span>

							<div className="flex items-center justify-between">
								<span className="text-sm text-white font-normal font-rubik">
									{hideEmail ? "··········" : `${user.email}`}
								</span>

								<button type="button" onClick={(): void => setHideEmail(!hideEmail)}>
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
										<title>Eye</title>
										<g clip-path="url(#clip0_284_119)">
											<path
												d="M10 12C10 12.5304 10.2107 13.0391 10.5858 13.4142C10.9609 13.7893 11.4696 14 12 14C12.5304 14 13.0391 13.7893 13.4142 13.4142C13.7893 13.0391 14 12.5304 14 12C14 11.4696 13.7893 10.9609 13.4142 10.5858C13.0391 10.2107 12.5304 10 12 10C11.4696 10 10.9609 10.2107 10.5858 10.5858C10.2107 10.9609 10 11.4696 10 12Z"
												stroke="white"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
											<path
												d="M21 12C18.6 16 15.6 18 12 18C8.4 18 5.4 16 3 12C5.4 8 8.4 6 12 6C15.6 6 18.6 8 21 12Z"
												stroke="white"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
										</g>
										<defs>
											<clipPath id="clip0_284_119">
												<rect width="24" height="24" fill="white" />
											</clipPath>
										</defs>
									</svg>
								</button>
							</div>
						</div>

						<div className="flex flex-col gap-y-1">
							<span className="text-sm text-white font-normal font-rubik">Password</span>

							<button type="button" className="btn bg-grey px-2 py-1 w-fit">
								<span className="text-xs text-light font-medium font-rubik">Change password</span>
							</button>
						</div>
					</div>

					<button type="button" className="btn bg-red px-2 py-1 w-fit">
						<span className="text-xs font-medium font-rubik">Delete account</span>
					</button>
				</div>
			</div>
		</Modal>
	);
}

export default SettingsModal;
