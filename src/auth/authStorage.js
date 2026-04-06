const USERS_KEY = "crm-auth-users";
const SESSION_KEY = "crm-auth-session";
const RESET_KEY = "crm-auth-reset";

const defaultUsers = [
  {
    id: "user-1",
    name: "Admin User",
    email: "admin@crm.local",
    password: "Admin@123",
  },
];

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readJson(key, fallback) {
  if (!canUseStorage()) {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function initializeAuthStorage() {
  const users = readJson(USERS_KEY, null);

  if (!users || !Array.isArray(users) || users.length === 0) {
    writeJson(USERS_KEY, defaultUsers);
  }
}

export function getStoredUsers() {
  return readJson(USERS_KEY, defaultUsers);
}

export function getCurrentSession() {
  return readJson(SESSION_KEY, null);
}

export function loginWithLocalAuth(email, password) {
  const users = getStoredUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const matchedUser = users.find(
    (user) => user.email.toLowerCase() === normalizedEmail && user.password === password
  );

  if (!matchedUser) {
    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  const session = {
    id: matchedUser.id,
    name: matchedUser.name,
    email: matchedUser.email,
    loggedInAt: new Date().toISOString(),
  };

  writeJson(SESSION_KEY, session);

  return {
    success: true,
    session,
  };
}

export function logoutFromLocalAuth() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
}

export function createPasswordResetRequest(email) {
  const users = getStoredUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const matchedUser = users.find((user) => user.email.toLowerCase() === normalizedEmail);

  if (!matchedUser) {
    return {
      success: false,
      message: "No account found with that email.",
    };
  }

  const resetState = {
    email: matchedUser.email,
    code: "123456",
    requestedAt: new Date().toISOString(),
  };

  writeJson(RESET_KEY, resetState);

  return {
    success: true,
    email: matchedUser.email,
    code: resetState.code,
  };
}

export function getPasswordResetState() {
  return readJson(RESET_KEY, null);
}

export function verifyResetCodeAndPassword({ email, code, password }) {
  const resetState = getPasswordResetState();

  if (!resetState || resetState.email.toLowerCase() !== email.trim().toLowerCase()) {
    return {
      success: false,
      message: "Reset request not found. Please start again.",
    };
  }

  if (resetState.code !== code.trim()) {
    return {
      success: false,
      message: "Verification code is incorrect.",
    };
  }

  const users = getStoredUsers();
  const updatedUsers = users.map((user) =>
    user.email.toLowerCase() === resetState.email.toLowerCase()
      ? { ...user, password }
      : user
  );

  writeJson(USERS_KEY, updatedUsers);

  if (canUseStorage()) {
    window.localStorage.removeItem(RESET_KEY);
  }

  return {
    success: true,
    message: "Password updated successfully.",
  };
}
