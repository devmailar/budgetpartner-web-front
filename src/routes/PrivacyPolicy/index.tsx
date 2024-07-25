import type React from "react";

function PrivacyPolicy(): React.ReactNode {
	return (
		<div className="bg-radial-gradient w-screen h-screen text-white">
			<div>
				<h2>Privacy Policy</h2>
				<p>
					Your privacy is important to us. This privacy policy explains how we collect, use, and protect your personal
					information when you visit our website.
				</p>
			</div>

			<div>
				<h2>Information We Collect</h2>
				<p>- Personal identification information (email address, country)</p>
				<p>- Usage data (pages visited, time spent on site.)</p>
			</div>

			<div>
				<h2>How We Use Your Information</h2>
				<p>- To improve our website and services</p>
				<p>- To send periodic emails regarding your order or other products and services</p>
			</div>

			<div>
				<h2>Data Protection</h2>
				<p>We implement a variety of security measures to maintain the safety of your personal information.</p>
			</div>

			<div>
				<h2>Your Rights</h2>
				<p>
					You have the right to access, correct, or delete your personal data. Contact us at [your email] for any
					requests.
				</p>
			</div>
		</div>
	);
}

export default PrivacyPolicy;
