import React from "react";

function CreateAnAccount() {
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	const handleCreate = async (
		event: React.FormEvent<HTMLFormElement>,
	): Promise<void> => {
		try {
			event.preventDefault();

			const form: FormData = new FormData(event.currentTarget);
			const email: string = form.get("email") as string;

			console.table({ email });
			setIsLoading(true);
		} catch (error: unknown) {
			if (error instanceof Error) {
				throw error;
			}
		}
	};

	return (
		<div className="flex items-center justify-center bg-radial-gradient w-screen h-screen">
			<form className="flex flex-col gap-y-4 w-[26rem]" onSubmit={handleCreate}>
				<div className="flex flex-col gap-y-5">
					<div className="flex flex-col gap-y-1 items-center">
						<h1 className="text-2xl text-white font-medium font-rubik">
							Create an account
						</h1>
						<p className="text-base text-white font-normal font-rubik">
							Enter your email to sign up for this app
						</p>
					</div>

					<div className="flex flex-col gap-y-3 ">
						<input
							className="bg-[#202020] border-[#895FF5] border-2 p-2 text-xl text-white font-normal font-rubik rounded-lg"
							type="email"
							id="email"
							name="email"
							placeholder="support@budget-partner.com"
							autoComplete="email"
							required
						/>
					</div>
				</div>

				<div className="flex flex-col gap-y-3">
					<input
						className="btn bg-[#895FF5] text-sm text-white font-medium py-2.5 rounded-lg"
						type="submit"
						value="Sign up with email"
						disabled={isLoading}
					/>

					<div className="text-center px-4">
						<p className="text-base text-white font-light font-rubik">
							By clicking continue, you agree to our{" "}
							<a href="terms-of-service" className="text-[#895FF5]">
								Terms of Service
							</a>{" "}
							and{" "}
							<a href="privacy-policy" className="text-[#895FF5]">
								Privacy Policy
							</a>
						</p>
					</div>
				</div>
			</form>
		</div>
	);
}

export default CreateAnAccount;
