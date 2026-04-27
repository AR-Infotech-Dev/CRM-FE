// export const API_BASE_URL = import.meta.env.API_BASE_URL || "http://localhost:3000/api/v1" ;
// export const API_BASE_URL = import.meta.env.API_BASE_URL || "http://192.168.1.3:3000/api/v1" ;
export const API_BASE_URL = import.meta.env.API_BASE_URL || "https://flowups-be.onrender.com/api/v1" ;
export const APP_NAME = import.meta.env.APP_NAME || "flowupS" ;

export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  'Accept': 'application/json',
  'Authorization': localStorage.getItem("_bb_key") ? `Bearer ${localStorage.getItem("_bb_key")}` : "",
  'authid': localStorage.getItem("_auth_id")
};

export const getDefaultHeaders = () => {
  const token = localStorage.getItem("_bb_key");
  const authid = localStorage.getItem("_auth_id");

  return {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": token ? `Bearer ${token}` : "",
    "authid": authid || ""
  };
};