import { useEffect, useMemo, useState } from "react";
import ForgotPasswordPage from "./auth/ForgotPasswordPage";
import LoginPage from "./auth/LoginPage";
import VerificationPage from "./auth/VerificationPage";
import {
  createPasswordResetRequest,
  getCurrentSession,
  initializeAuthStorage,
  loginWithLocalAuth,
  logoutFromLocalAuth,
  verifyResetCodeAndPassword,
} from "./auth/authStorage";
import AppShell from "./components/layout/AppShell";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import { UsersModulePage } from "./modules/users";
import { UserRoleMasterModulePage } from "./modules/user-role-master";
import { AccessControlModulePage } from "./modules/access-control";
import { MenuMasterModulePage } from "./modules/menu-master";
import { LoginModulePage } from "./modules/login";

function App() {
  const [authView, setAuthView] = useState("login");
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
  const [activeModule, setActiveModule] = useState("users");

  useEffect(() => {
    initializeAuthStorage();
    const session = getCurrentSession();

    if (session) {
      setAuthSession(session);
    }
  }, []);

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((current) => ({ ...current, [name]: value }));
  };

  const handleForgotChange = (event) => {
    const { name, value } = event.target;
    setForgotForm((current) => ({ ...current, [name]: value }));
  };

  const handleVerificationChange = (event) => {
    const { name, value } = event.target;
    setVerificationForm((current) => ({ ...current, [name]: value }));
  };

  const resetAuthMessages = () => {
    setAuthError("");
    setAuthHelperText("");
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    resetAuthMessages();

    const result = loginWithLocalAuth(loginForm.email, loginForm.password);

    if (!result.success) {
      setAuthError(result.message);
      return;
    }

    setAuthSession(result.session);
    setLoginForm({ email: "", password: "" });
  };

  const handleForgotSubmit = (event) => {
    event.preventDefault();
    resetAuthMessages();

    const result = createPasswordResetRequest(forgotForm.email);

    if (!result.success) {
      setAuthError(result.message);
      return;
    }

    setVerificationForm({
      email: result.email,
      code: "",
      password: "",
    });
    setAuthHelperText("Verification code generated. Use 123456 to continue.");
    setAuthView("verification");
  };

  const handleVerificationSubmit = (event) => {
    event.preventDefault();
    resetAuthMessages();

    const result = verifyResetCodeAndPassword(verificationForm);

    if (!result.success) {
      setAuthError(result.message);
      return;
    }

    setLoginForm({
      email: verificationForm.email,
      password: "",
    });
    setForgotForm({ email: "" });
    setVerificationForm({ email: "", code: "", password: "" });
    setAuthHelperText("Password reset successful. Please log in with your new password.");
    setAuthView("login");
  };

  const handleLogout = () => {
    logoutFromLocalAuth();
    setAuthSession(null);
    setAuthView("login");
    setActiveModule("users");
    setLoginForm({ email: "", password: "" });
    setAuthHelperText("You have been logged out.");
    setAuthError("");
  };

  const ActiveModule = useMemo(() => {
    const moduleRegistry = {
      users: UsersModulePage,
      userRoleMaster: UserRoleMasterModulePage,
      accessControl: AccessControlModulePage,
      menuMaster: MenuMasterModulePage,
      login: LoginModulePage,
    };

    return moduleRegistry[activeModule] || UsersModulePage;
  }, [activeModule]);

  if (!authSession) {
    if (authView === "forgot") {
      return (
        <ForgotPasswordPage
          formData={forgotForm}
          error={authError}
          helperText={authHelperText}
          onChange={handleForgotChange}
          onSubmit={handleForgotSubmit}
          onBack={() => {
            resetAuthMessages();
            setAuthView("login");
          }}
        />
      );
    }

    if (authView === "verification") {
      return (
        <VerificationPage
          formData={verificationForm}
          error={authError}
          helperText={authHelperText}
          onChange={handleVerificationChange}
          onSubmit={handleVerificationSubmit}
          onBack={() => {
            resetAuthMessages();
            setAuthView("forgot");
          }}
        />
      );
    }

    return (
      <LoginPage
        formData={loginForm}
        error={authError}
        helperText={authHelperText}
        onChange={handleLoginChange}
        onSubmit={handleLoginSubmit}
        onForgotPassword={() => {
          resetAuthMessages();
          setForgotForm({ email: loginForm.email });
          setAuthView("forgot");
        }}
      />
    );
  }

  return (
    <AppShell
      topbar={<TopBar onLogout={handleLogout} />}
      sidebar={<Sidebar activeModule={activeModule} onSelectModule={setActiveModule} />}
      toolbar={null}
      overlay={null}
    >
      <ActiveModule />
    </AppShell>
  );
}

export default App;
