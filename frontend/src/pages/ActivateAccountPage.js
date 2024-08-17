import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { verify } from "../store/auth";

const ActivateAccountPage = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { uid, token } = useParams();

	const [verified, setVerified] = useState(false);

	const handleVerifyAccount = () => {
		dispatch(verify(uid, token));
		setVerified(true);
	};

	useEffect(() => {
		if (verified) {
			toast.success(
				"Account verified successfully. You can now Sign In!"
			);
			navigate("/signin");
		}
	}, [verified, navigate]);

	return (
		<div className="d-flex align-items-center justify-content-center vh-100">
			<div
				className="text-center p-4"
				style={{ maxWidth: "400px", width: "100%" }}
			>
				<h2 className="mb-4">Activate Your Account</h2>
				<p className="mb-4">
					Click the button below to verify your account.
				</p>
				<button
					className="btn btn-primary btn-block"
					onClick={handleVerifyAccount}
					style={{ borderRadius: "50px" }}
				>
					Verify Account
				</button>
			</div>
		</div>
	);
};

export default ActivateAccountPage;
