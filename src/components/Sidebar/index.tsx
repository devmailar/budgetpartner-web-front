function Sidebar() {
	return (
		<div className="absolute px-4 py-4 bg-black border-r border-r-[#4B4B4B] h-screen">
			<div className="flex flex-col items-center justify-between h-full">
				<div className="flex flex-col gap-y-20 items-center">
					<span className="text-3xl text-[#895FF5] font-black font-rubik">BP</span>

					<div className="flex flex-col">
						<button type="button" className="flex items-center justify-center p-3">
							<svg xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 40 40" fill="none">
								<title>Home</title>
								<g clip-path="url(#clip0_103_77)">
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
								<g clip-path="url(#clip0_103_84)">
									<path
										d="M9.99996 6.6665H30C30.884 6.6665 31.7319 7.01769 32.357 7.64281C32.9821 8.26794 33.3333 9.11578 33.3333 9.99984V21.6665H25C24.1159 21.6665 23.2681 22.0177 22.6429 22.6428C22.0178 23.2679 21.6666 24.1158 21.6666 24.9998V33.3332H9.99996C9.1159 33.3332 8.26806 32.982 7.64294 32.3569C7.01782 31.7317 6.66663 30.8839 6.66663 29.9998V9.99984C6.66663 9.11578 7.01782 8.26794 7.64294 7.64281C8.26806 7.01769 9.1159 6.6665 9.99996 6.6665Z"
										stroke="white"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M33.3333 21.6665V21.9532C33.3331 22.8372 32.9818 23.6849 32.3566 24.3098L24.31 32.3565C23.685 32.9817 22.8373 33.333 21.9533 33.3332H21.6666"
										stroke="white"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
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
								<g clip-path="url(#clip0_103_88)">
									<path
										d="M6.66663 8.33333C6.66663 7.44928 7.01782 6.60143 7.64294 5.97631C8.26806 5.35119 9.1159 5 9.99996 5H30C30.884 5 31.7319 5.35119 32.357 5.97631C32.9821 6.60143 33.3333 7.44928 33.3333 8.33333V31.6667C33.3333 32.5507 32.9821 33.3986 32.357 34.0237C31.7319 34.6488 30.884 35 30 35H9.99996C9.1159 35 8.26806 34.6488 7.64294 34.0237C7.01782 33.3986 6.66663 32.5507 6.66663 31.6667V8.33333Z"
										stroke="white"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M13.3334 13.3332C13.3334 12.8911 13.509 12.4672 13.8215 12.1547C14.1341 11.8421 14.558 11.6665 15 11.6665H25C25.4421 11.6665 25.866 11.8421 26.1786 12.1547C26.4911 12.4672 26.6667 12.8911 26.6667 13.3332V14.9998C26.6667 15.4419 26.4911 15.8658 26.1786 16.1783C25.866 16.4909 25.4421 16.6665 25 16.6665H15C14.558 16.6665 14.1341 16.4909 13.8215 16.1783C13.509 15.8658 13.3334 15.4419 13.3334 14.9998V13.3332Z"
										stroke="white"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M13.3334 23.3335V23.3502"
										stroke="white"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M20 23.3335V23.3502"
										stroke="white"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M26.6666 23.3335V23.3502"
										stroke="white"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M13.3334 28.3335V28.3502"
										stroke="white"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M20 28.3335V28.3502"
										stroke="white"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M26.6666 28.3335V28.3502"
										stroke="white"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
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
								<g clip-path="url(#clip0_102_69)">
									<path
										d="M20 3.3335L21.07 3.34183L22.0966 3.37016L22.595 3.39183L23.56 3.4485L24.4816 3.52516C32.2933 4.2835 35.565 7.4135 36.425 15.0352L36.475 15.5185L36.5516 16.4402L36.62 17.6518L36.63 17.9018L36.6583 18.9302L36.6666 20.0002L36.6583 21.0702L36.63 22.0968L36.6083 22.5952L36.5516 23.5602L36.475 24.4818C35.7166 32.2935 32.5866 35.5652 24.965 36.4252L24.4816 36.4752L23.56 36.5518L22.3483 36.6202L22.0983 36.6302L21.07 36.6585L20 36.6668L18.93 36.6585L17.9033 36.6302L17.405 36.6085L16.44 36.5518L15.5183 36.4752C7.70663 35.7168 4.43496 32.5868 3.57496 24.9652L3.52496 24.4818L3.44829 23.5602L3.37996 22.3485L3.36996 22.0985L3.34163 21.0702L3.33496 20.5402V19.4602L3.34163 18.9302L3.36996 17.9035L3.39163 17.4052L3.44829 16.4402L3.52496 15.5185C4.28329 7.70683 7.41329 4.43516 15.035 3.57516L15.5183 3.52516L16.44 3.4485L17.6516 3.38016L17.9016 3.37016L18.93 3.34183C19.28 3.33683 19.6366 3.3335 20 3.3335ZM20 18.3335H18.3333L18.1383 18.3452C17.7332 18.3933 17.3599 18.5884 17.089 18.8934C16.8181 19.1985 16.6685 19.5922 16.6685 20.0002C16.6685 20.4081 16.8181 20.8019 17.089 21.1069C17.3599 21.4119 17.7332 21.607 18.1383 21.6552L18.3333 21.6668V26.6668L18.345 26.8618C18.3888 27.2339 18.5568 27.5803 18.8216 27.8451C19.0865 28.11 19.4329 28.278 19.805 28.3218L20 28.3335H21.6666L21.8616 28.3218C22.2337 28.278 22.5801 28.11 22.8449 27.8451C23.1098 27.5803 23.2778 27.2339 23.3216 26.8618L23.3333 26.6668L23.3216 26.4718C23.2818 26.1318 23.1382 25.8123 22.9104 25.5567C22.6825 25.3012 22.3815 25.122 22.0483 25.0435L21.8616 25.0102L21.6666 25.0002V20.0002L21.655 19.8052C21.6111 19.4331 21.4432 19.0867 21.1783 18.8218C20.9134 18.557 20.567 18.389 20.195 18.3452L20 18.3335ZM20.0166 13.3335L19.805 13.3452C19.3999 13.3933 19.0265 13.5884 18.7556 13.8934C18.4848 14.1985 18.3352 14.5922 18.3352 15.0002C18.3352 15.4081 18.4848 15.8019 18.7556 16.1069C19.0265 16.4119 19.3999 16.607 19.805 16.6552L20 16.6668L20.2116 16.6552C20.6167 16.607 20.9901 16.4119 21.2609 16.1069C21.5318 15.8019 21.6814 15.4081 21.6814 15.0002C21.6814 14.5922 21.5318 14.1985 21.2609 13.8934C20.9901 13.5884 20.6167 13.3933 20.2116 13.3452L20.0166 13.3335Z"
										fill="white"
									/>
								</g>
								<defs>
									<clipPath id="clip0_102_69">
										<rect width="40" height="40" fill="white" />
									</clipPath>
								</defs>
							</svg>
						</button>
					</div>
				</div>

				<button type="button" className="flex items-center justify-center p-3">
					<svg xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 40 40" fill="none">
						<title>Menu</title>
						<g clip-path="url(#clip0_103_124)">
							<path
								d="M6.66663 13.3335H33.3333"
								stroke="white"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M6.66663 26.6665H33.3333"
								stroke="white"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</g>
						<defs>
							<clipPath id="clip0_103_124">
								<rect width="40" height="40" fill="white" />
							</clipPath>
						</defs>
					</svg>
				</button>
			</div>
		</div>
	);
}

export default Sidebar;
