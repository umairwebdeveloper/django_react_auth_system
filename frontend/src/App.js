import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "./store/configureStore";
import Layout from "./hoc/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ActivateAccountPage from "./pages/ActivateAccountPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ResetPasswordConfirmPage from "./pages/ResetPasswordConfirmPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import ProfilePage from "./pages/ProfilePage";
import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";

const store = configureStore();

const App = () => {
	return (
		<Provider store={store}>
			<Router>
				<Layout>
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/signin" element={<LoginPage />} />
						<Route path="/signup" element={<SignUpPage />} />
						<Route path="/profile" element={<ProfilePage />} />
						<Route path="/dashboard" element={<DashboardPage />} />
						<Route
							path="/email-sent"
							element={<EmailVerificationPage />}
						/>
						<Route
							path="/activate/:uid/:token"
							element={<ActivateAccountPage />}
						/>
						<Route
							path="/reset-password"
							element={<ResetPasswordPage />}
						/>
						<Route
							path="/password/reset/confirm/:uid/:token"
							element={<ResetPasswordConfirmPage />}
						/>
						<Route path="*" element={<NotFoundPage />} />
					</Routes>
				</Layout>
			</Router>
		</Provider>
	);
};

export default App;
