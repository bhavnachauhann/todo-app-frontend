function OnboardingScreen({ onGetStarted }) {
	return (
		<div className="onboarding-page">
			<div className="onboarding-wrapper">
				<div className="onboarding-title">Onboarding</div>

				<div className="onboarding-screen">
					{/* Blue Top Section */}
					<div className="onboarding-hero">
						{/* Top Right Circle */}
						<div className="hero-circle"></div>

						{/* Left Zig Zag */}
						<div className="zigzag zigzag-left">
							<span></span>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
						</div>

						{/* Right Zig Zag */}
						<div className="zigzag zigzag-right">
							<span></span>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
						</div>
					</div>

					{/* Bottom Content */}
					<div className="onboarding-content">
						<h1>Manage What To Do</h1>

						<p>
							The best way to manage what you have to do,
							<br />
							don't forget your plans
						</p>

						<button onClick={onGetStarted}>Get Started</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default OnboardingScreen;
