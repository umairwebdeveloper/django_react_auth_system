import React from "react";

const EmailVerificationPage = () => {
	const openGmail = () => {
		window.open("https://mail.google.com", "_blank");
	};

	return (
		<div className="d-flex align-items-center justify-content-center vh-100">
			<div
				className="text-center p-4"
				style={{ maxWidth: "400px", width: "100%" }}
			>
				<h2 className="mb-4">Check Your Email</h2>
				<p className="mb-4">
					Click the button below to open your email inbox.
				</p>
				<button
					className="btn btn-primary btn-block"
					onClick={openGmail}
					style={{ borderRadius: "50px" }}
				>
					Open Gmail
				</button>
			</div>
		</div>
	);
};

export default EmailVerificationPage;
