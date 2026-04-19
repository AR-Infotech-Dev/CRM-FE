const TOKEN_KEY = "_bb_key";
const AUTH_KEY = "_auth_id";
const USER_KEY = "user";

export const saveAuthSession = ({ token, user ,authid}) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(AUTH_KEY, authid);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuthSession = () => {
  localStorage.removeItem("_bb_key");
  localStorage.removeItem("_auth_id");
  localStorage.removeItem("user");
};

export const getCurrentSession = () => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) return null;

  return {
    token,
    user: JSON.parse(localStorage.getItem(USER_KEY) || "{}")

  };
};

export const logoutFromLocalAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(AUTH_KEY);
};