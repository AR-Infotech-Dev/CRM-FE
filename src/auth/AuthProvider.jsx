import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createPasswordResetRequest,
  getCurrentSession,
  initializeAuthStorage,
  loginWithLocalAuth,
  logoutFromLocalAuth,
  verifyResetCodeAndPassword,
} from "./authStorage";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [authSession, setAuthSession] = useState(null);
  const [authError, setAuthError] = useState("");
  const [authHelperText, setAuthHelperText] = useState("");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [forgotForm, setForgotForm] = useState({ email: "" });
  const [verificationForm, setVerificationForm] = useState({
    email: "",
    code: "",
    password: "",
  });

  useEffect(() => {
    initializeAuthStorage();
    const session = getCurrentSession();
    if (session) {
      setAuthSession(session);
    }
  }, []);

  const resetAuthMessages = () => {
    setAuthError("");
    setAuthHelperText("");
  };

  const value = useMemo(
    () => ({
      authSession,
      authError,
      authHelperText,
      loginForm,
      forgotForm,
      verificationForm,
      setLoginForm,
      setForgotForm,
      setVerificationForm,
      resetAuthMessages,
      setAuthError,
      setAuthHelperText,
      login(email, password) {
        resetAuthMessages();
        const result = loginWithLocalAuth(email, password);

        if (!result.success) {
          setAuthError(result.message);
          return result;
        }

        setAuthSession(result.session);
        setLoginForm({ email: "", password: "" });
        return result;
      },
      requestPasswordReset(email) {
        resetAuthMessages();
        const result = createPasswordResetRequest(email);

        if (!result.success) {
          setAuthError(result.message);
          return result;
        }

        setVerificationForm({
          email: result.email,
          code: "",
          password: "",
        });
        setAuthHelperText("Verification code generated. Use 123456.");
        return result;
      },
      verifyReset(payload) {
        resetAuthMessages();
        const result = verifyResetCodeAndPassword(payload);

        if (!result.success) {
          setAuthError(result.message);
          return result;
        }

        setAuthHelperText("Password reset successful.");
        return result;
      },
      logout() {
        logoutFromLocalAuth();
        setAuthSession(null);
        setAuthHelperText("Logged out successfully.");
      },
    }),
    [authError, authHelperText, authSession, forgotForm, loginForm, verificationForm]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

export default AuthProvider;
