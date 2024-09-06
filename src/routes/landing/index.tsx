import Spline from "@splinetool/react-spline";
import type React from "react";

function Landing(): React.ReactNode {
	return (
		<div className="flex flex-wrap items-center justify-center h-screen py-10 px-10 animate__faster animate__animated animate__fadeIn animate__delay-1s">
			<h1 className="text-6xl md:text-8xl text-white text-center font-medium">
				BudgetPartner <br /> simplifies <br /> budgeting
			</h1>

			<div className="">
				<Spline scene="https://prod.spline.design/0lbtSgPIX6ZHmqHi/scene.splinecode" renderOnDemand />
			</div>
		</div>
	);
}

export default Landing;
