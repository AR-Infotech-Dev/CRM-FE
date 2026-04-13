import { Navigate, Route, useNavigate } from "react-router-dom";
import ForgotPasswordPage from "../auth/ForgotPasswordPage";
import LoginPage from "../auth/LoginPage";
import VerificationPage from "../auth/VerificationPage";
import { useAuth } from "../auth/AuthProvider";

function LoginRoute() {
  const navigate = useNavigate();
  const {
    authSession,
    authError,
    authHelperText,
    loginForm,
    setLoginForm,
    setForgotForm,
    login,
  } = useAuth();

  if (authSession) {
    return <Navigate to="/users" replace />;
  }

  return (
    <LoginPage
      formData={loginForm}
      error={authError}
      helperText={authHelperText}
      onChange={(event) => {
        const { name, value } = event.target;
        setLoginForm((prev) => ({ ...prev, [name]: value }));
      }}
      onSubmit={(event) => {
        event.preventDefault();
        login(loginForm.email, loginForm.password);
      }}
      onForgotPassword={() => {
        setForgotForm({ email: loginForm.email });
        navigate("/forgot-password");
      }}
    />
  );
}

function ForgotPasswordRoute() {
  const navigate = useNavigate();
  const {
    authSession,
    authError,
    authHelperText,
    forgotForm,
    setForgotForm,
    requestPasswordReset,
  } = useAuth();

  if (authSession) {
    return <Navigate to="/users" replace />;
  }

  return (
    <ForgotPasswordPage
      formData={forgotForm}
      error={authError}
      helperText={authHelperText}
      onChange={(event) => {
        const { name, value } = event.target;
        setForgotForm((prev) => ({ ...prev, [name]: value }));
      }}
      onSubmit={(event) => {
        event.preventDefault();
        const result = requestPasswordReset(forgotForm.email);
        if (result?.success) {
          navigate("/verify-reset");
        }
      }}
      onBack={() => {
        navigate("/login");
      }}
    />
  );
}

function VerificationRoute() {
  const navigate = useNavigate();
  const {
    authSession,
    authError,
    authHelperText,
    verificationForm,
    setVerificationForm,
    verifyReset,
  } = useAuth();

  if (authSession) {
    return <Navigate to="/users" replace />;
  }

  return (
    <VerificationPage
      formData={verificationForm}
      error={authError}
      helperText={authHelperText}
      onChange={(event) => {
        const { name, value } = event.target;
        setVerificationForm((prev) => ({ ...prev, [name]: value }));
      }}
      onSubmit={(event) => {
        event.preventDefault();
        const result = verifyReset(verificationForm);
        if (result?.success) {
          navigate("/login");
        }
      }}
      onBack={() => {
        navigate("/forgot-password");
      }}
    />
  );
}

export function getAuthRoutes() {
  return (
    <>
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/forgot-password" element={<ForgotPasswordRoute />} />
      <Route path="/verify-reset" element={<VerificationRoute />} />
    </>
  );
}
