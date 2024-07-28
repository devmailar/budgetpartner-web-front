import type { Dispatch } from "@reduxjs/toolkit";
import type React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { NavigateFunction } from "react-router-dom";
import { removeCookie } from "typescript-cookie";
import ArtLogo from "../../assets/logo.png";
import { setError } from "../../stores/Error";
import { setModals } from "../../stores/Modals";
import type { IRootState, IUser } from "../../types";

interface IRouter {
	navigate: NavigateFunction;
}

interface ISidebarProps {
	router: IRouter;
}

function Sidebar({ router }: ISidebarProps): React.ReactNode {
	const dispatch: Dispatch = useDispatch();

	const user: IUser = useSelector((state: IRootState) => state.user);

	const handleOpenSettingsModal = (): void => {
		try {
			dispatch(
				setModals({
					extraincome: false,
					extraexpense: false,
					language: false,
					settings: true,
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
			router.navigate("/login");
			window.location.reload();
		} catch (error: unknown) {
			if (error instanceof Error) {
				dispatch(setError(error.message));
			}
		}
	};

	return (
		<div className="absolute px-2 py-6 bg-black border-r border-r-grey h-screen">
			<div className="flex flex-col items-center justify-between h-full">
				<div className="flex flex-col gap-y-20 items-center">
					<img src={ArtLogo} alt={ArtLogo} width={42} />

					<div className="flex flex-col">
						<button
							type="button"
							className="flex items-center justify-center p-3"
							onClick={(): void => router.navigate("/")}
						>
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

						<button
							type="button"
							className="flex items-center justify-center p-3"
							onClick={() => dispatch(setError("Coming soon! ✨"))}
						>
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

						<button
							type="button"
							className="flex items-center justify-center p-3"
							onClick={() => dispatch(setError("Coming soon! ✨"))}
						>
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

						<button
							type="button"
							className="flex items-center justify-center p-3"
							onClick={() => dispatch(setError("Coming soon! ✨"))}
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 40 40" fill="none">
								<title>Info</title>
								<g clipPath="url(#clip0_116_8)">
									<path
										d="M5 20C5 21.9698 5.38799 23.9204 6.14181 25.7403C6.89563 27.5601 8.00052 29.2137 9.3934 30.6066C10.7863 31.9995 12.4399 33.1044 14.2597 33.8582C16.0796 34.612 18.0302 35 20 35C21.9698 35 23.9204 34.612 25.7403 33.8582C27.5601 33.1044 29.2137 31.9995 30.6066 30.6066C31.9995 29.2137 33.1044 27.5601 33.8582 25.7403C34.612 23.9204 35 21.9698 35 20C35 18.0302 34.612 16.0796 33.8582 14.2597C33.1044 12.4399 31.9995 10.7863 30.6066 9.3934C29.2137 8.00052 27.5601 6.89563 25.7403 6.14181C23.9204 5.38799 21.9698 5 20 5C18.0302 5 16.0796 5.38799 14.2597 6.14181C12.4399 6.89563 10.7863 8.00052 9.3934 9.3934C8.00052 10.7863 6.89563 12.4399 6.14181 14.2597C5.38799 16.0796 5 18.0302 5 20Z"
										stroke="#FEFEFE"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M20 28.3335V28.3502"
										stroke="#FEFEFE"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M20 22.5C19.9693 21.9589 20.1152 21.4225 20.4158 20.9716C20.7164 20.5207 21.1554 20.1797 21.6666 20C22.2931 19.7604 22.8554 19.3787 23.3092 18.8849C23.7631 18.3911 24.0962 17.7987 24.2822 17.1543C24.4682 16.5099 24.5021 15.8311 24.3812 15.1714C24.2603 14.5117 23.9879 13.889 23.5855 13.3525C23.1831 12.8159 22.6616 12.3801 22.0621 12.0793C21.4626 11.7785 20.8015 11.621 20.1308 11.6192C19.4601 11.6173 18.7982 11.7711 18.197 12.0686C17.5959 12.366 17.072 12.799 16.6666 13.3333"
										stroke="#FEFEFE"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
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

				<div className="flex flex-col">
					{Object.keys(user).length > 0 && (
						<div className="flex flex-col">
							<button
								type="button"
								className="flex items-center justify-center p-3"
								onClick={(): void => handleOpenSettingsModal()}
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 40 40" fill="none">
									<title>Settings</title>
									<g clipPath="url(#clip0_279_157)">
										<path
											d="M17.2083 7.195C17.9183 4.26833 22.0817 4.26833 22.7917 7.195C22.8982 7.63467 23.107 8.04296 23.4012 8.38667C23.6953 8.73037 24.0665 8.99976 24.4844 9.17291C24.9024 9.34606 25.3553 9.41808 25.8063 9.38311C26.2573 9.34814 26.6937 9.20717 27.08 8.97167C29.6517 7.405 32.5967 10.3483 31.03 12.9217C30.7948 13.3078 30.6541 13.7439 30.6192 14.1946C30.5843 14.6453 30.6563 15.0979 30.8292 15.5156C31.0022 15.9333 31.2712 16.3043 31.6145 16.5984C31.9579 16.8925 32.3657 17.1015 32.805 17.2083C35.7317 17.9183 35.7317 22.0817 32.805 22.7917C32.3653 22.8982 31.957 23.107 31.6133 23.4012C31.2696 23.6953 31.0002 24.0665 30.8271 24.4844C30.6539 24.9024 30.5819 25.3553 30.6169 25.8063C30.6519 26.2573 30.7928 26.6937 31.0283 27.08C32.595 29.6517 29.6517 32.5967 27.0783 31.03C26.6922 30.7948 26.2561 30.6541 25.8054 30.6192C25.3547 30.5843 24.9021 30.6563 24.4844 30.8292C24.0667 31.0022 23.6957 31.2712 23.4016 31.6145C23.1075 31.9579 22.8985 32.3657 22.7917 32.805C22.0817 35.7317 17.9183 35.7317 17.2083 32.805C17.1018 32.3653 16.893 31.957 16.5988 31.6133C16.3047 31.2696 15.9335 31.0002 15.5156 30.8271C15.0976 30.6539 14.6447 30.5819 14.1937 30.6169C13.7427 30.6519 13.3063 30.7928 12.92 31.0283C10.3483 32.595 7.40333 29.6517 8.97 27.0783C9.20517 26.6922 9.34592 26.2561 9.38081 25.8054C9.41569 25.3547 9.34374 24.9021 9.17079 24.4844C8.99783 24.0667 8.72877 23.6957 8.38545 23.4016C8.04214 23.1075 7.63427 22.8985 7.195 22.7917C4.26833 22.0817 4.26833 17.9183 7.195 17.2083C7.63467 17.1018 8.04296 16.893 8.38667 16.5988C8.73037 16.3047 8.99976 15.9335 9.17291 15.5156C9.34606 15.0976 9.41808 14.6447 9.38311 14.1937C9.34814 13.7427 9.20717 13.3063 8.97167 12.92C7.405 10.3483 10.3483 7.40333 12.9217 8.97C14.5883 9.98333 16.7483 9.08667 17.2083 7.195Z"
											stroke="#FEFEFE"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<path
											d="M15 20C15 21.3261 15.5268 22.5979 16.4645 23.5355C17.4021 24.4732 18.6739 25 20 25C21.3261 25 22.5979 24.4732 23.5355 23.5355C24.4732 22.5979 25 21.3261 25 20C25 18.6739 24.4732 17.4021 23.5355 16.4645C22.5979 15.5268 21.3261 15 20 15C18.6739 15 17.4021 15.5268 16.4645 16.4645C15.5268 17.4021 15 18.6739 15 20Z"
											stroke="#FEFEFE"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</g>
									<defs>
										<clipPath id="clip0_279_157">
											<rect width="40" height="40" fill="white" />
										</clipPath>
									</defs>
								</svg>
							</button>

							<button
								type="button"
								className="flex items-center justify-center p-3"
								onClick={(): void => handleLogout()}
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 24 24" fill="none">
									<title>Logout</title>
									<path
										opacity="0.2"
										d="M21 5.25V18.75C21 19.1478 20.842 19.5294 20.5607 19.8107C20.2794 20.092 19.8978 20.25 19.5 20.25H4.5V3.75H19.5C19.8978 3.75 20.2794 3.90804 20.5607 4.18934C20.842 4.47064 21 4.85218 21 5.25Z"
										fill="white"
									/>
									<path
										d="M11.25 20.25C11.25 20.4489 11.171 20.6397 11.0303 20.7803C10.8897 20.921 10.6989 21 10.5 21H4.5C4.30109 21 4.11032 20.921 3.96967 20.7803C3.82902 20.6397 3.75 20.4489 3.75 20.25V3.75C3.75 3.55109 3.82902 3.36032 3.96967 3.21967C4.11032 3.07902 4.30109 3 4.5 3H10.5C10.6989 3 10.8897 3.07902 11.0303 3.21967C11.171 3.36032 11.25 3.55109 11.25 3.75C11.25 3.94891 11.171 4.13968 11.0303 4.28033C10.8897 4.42098 10.6989 4.5 10.5 4.5H5.25V19.5H10.5C10.6989 19.5 10.8897 19.579 11.0303 19.7197C11.171 19.8603 11.25 20.0511 11.25 20.25ZM21.5306 11.4694L17.7806 7.71937C17.6399 7.57864 17.449 7.49958 17.25 7.49958C17.051 7.49958 16.8601 7.57864 16.7194 7.71937C16.5786 7.86011 16.4996 8.05098 16.4996 8.25C16.4996 8.44902 16.5786 8.63989 16.7194 8.78063L19.1897 11.25H10.5C10.3011 11.25 10.1103 11.329 9.96967 11.4697C9.82902 11.6103 9.75 11.8011 9.75 12C9.75 12.1989 9.82902 12.3897 9.96967 12.5303C10.1103 12.671 10.3011 12.75 10.5 12.75H19.1897L16.7194 15.2194C16.5786 15.3601 16.4996 15.551 16.4996 15.75C16.4996 15.949 16.5786 16.1399 16.7194 16.2806C16.8601 16.4214 17.051 16.5004 17.25 16.5004C17.449 16.5004 17.6399 16.4214 17.7806 16.2806L21.5306 12.5306C21.6004 12.461 21.6557 12.3783 21.6934 12.2872C21.7312 12.1962 21.7506 12.0986 21.7506 12C21.7506 11.9014 21.7312 11.8038 21.6934 11.7128C21.6557 11.6217 21.6004 11.539 21.5306 11.4694Z"
										fill="white"
									/>
								</svg>
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default Sidebar;
