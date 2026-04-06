import AuthShell from "./AuthShell";

function LoginPage({
  formData,
  error,
  helperText,
  onChange,
  onSubmit,
  onForgotPassword,
}) {
  return (
    <AuthShell
      title="Login to CRM"
      subtitle="Sign in to continue to your workspace and module dashboard."
      footer={
        <div className="auth-footer-copy">
          <span>Demo login:</span>
          <strong>admin@crm.local / Admin@123</strong>
        </div>
      }
    >
      <form className="auth-form" onSubmit={onSubmit}>
        <label className="auth-field">
          <span className="auth-label">Email</span>
          <input
            className="auth-input"
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            placeholder="Enter your email"
            autoComplete="off"
          />
        </label>

        <label className="auth-field">
          <span className="auth-label">Password</span>
          <input
            className="auth-input"
            type="password"
            name="password"
            value={formData.password}
            onChange={onChange}
            placeholder="Enter your password"
            autoComplete="off"
          />
        </label>

        {error ? <div className="auth-message error">{error}</div> : null}
        {helperText ? <div className="auth-message info">{helperText}</div> : null}

        <div className="auth-actions">
          <button type="submit" className="auth-button auth-button-primary">
            Login
          </button>
          <button
            type="button"
            className="auth-button auth-button-secondary"
            onClick={onForgotPassword}
          >
            Forgot Password
          </button>
        </div>
      </form>
    </AuthShell>
  );
}

export default LoginPage;
