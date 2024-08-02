import type { Dispatch } from "@reduxjs/toolkit";
import React from "react";
import { useDispatch } from "react-redux";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { getCookie } from "typescript-cookie";
import { setLoader } from "../../stores/Loader";

function PrivacyPolicy(): React.ReactNode {
	const dispatch: Dispatch = useDispatch();
	const navigate: NavigateFunction = useNavigate();

	React.useEffect((): void => {
		const auth: string = getCookie("Authorization") ?? "";
		if (!auth) {
			navigate("/login");
			return;
		}

		dispatch(setLoader(false));
	}, [dispatch, navigate]);

	return (
		<div className="flex justify-center bg-black">
			<div className="flex flex-col mx-28 my-6 text-base text-white font-light font-rubik leading-tight">
				<h1>Welcome to Budget Partner</h1>
				<p>Effective Date: July 26, 2024</p>
				<br />
				<p>
					This Privacy Policy is meant to help you understand what information we collect, why we collect it, and how
					you can manage it.
				</p>
				<br />
				<h2>1. Information We Collect</h2>
				<p>
					As a platform dedicated to privacy and security, we strive to collect the minimum amount of information
					necessary. We DO NOT collect any personally identifiable information (PII) about you unless you choose to
					provide it to us voluntarily. You decide whether to proceed with any activity that requests personal
					information.
				</p>
				<br />
				<h3>1.1 Third-Party Services</h3>
				<p>
					Our platform is hosted on Cloudflare, which employs a feature called Browser Insights to collect performance
					and geolocation metrics. This information aids in optimizing and improving the performance of Budget Partner.
					Importantly, Cloudflare does not store any personally identifiable data from our users. For more in-depth
					information on how Cloudflare uses Browser Insights, you can visit their blog post{" "}
					<a className="text-purple underline" href="https://blog.cloudflare.com/browser-insights/">
						here
					</a>
					.
				</p>
				<br />
				<h2>2. Use of Your Information</h2>
				<p>
					Any personal information that you provide to us, like your name and email for account setup, will be used
					solely to maintain your Budget Partner account, provide you with the services of Budget Partner, and
					communicate with you about your account or our services.
				</p>
				<br />
				<h2>3. Cookies and Tracking</h2>
				<p>
					Budget Partner does not use cookies to track your activity. No third-party cookies are used on our platform,
					and no tracking cookies are used by us.
				</p>
				<br />
				<h2>4. Advertising</h2>
				<p>
					We do not host any third-party advertisements on the Budget Partner platform. As such, no advertising cookies
					or tracking systems are used.
				</p>
				<br />
				<h2>5. Data Sharing and Transfer</h2>
				<p>
					We do not sell or rent your personal information to any third parties under any circumstances. The personal
					information you provide to us is stored and processed in the location in which it was collected unless
					otherwise required by law.
				</p>
				<br />
				<h2>6. Security of Your Information</h2>
				<p>
					We prioritize the security of your information and employ administrative, technical, and physical safeguards
					designed to protect against the loss, misuse, unplatform-authd access, disclosure, alteration, or destruction
					of the information we collect.
				</p>
				<br />
				<h2>7. Changes to Our Privacy Policy</h2>
				<p>
					We may update our Privacy Policy from time to time. If we make changes, we will post the new policy here with
					a new effective date. Your continued use of Budget Partner after any changes to the Privacy Policy constitutes
					your acceptance of the new terms.
				</p>
				<br />
				<h2>8. Contact Us</h2>
				<p>
					If you have any questions about this Privacy Policy or our data handling practices, please contact us at{" "}
					<a className="text-purple underline" href="mailto:support@budgetpartner.app">
						support@budgetpartner.app
					</a>
					.
				</p>
				<br />
				<p>Thank you for choosing Budget Partner, where we value your privacy and data security.</p>
			</div>
		</div>
	);
}

export default PrivacyPolicy;
