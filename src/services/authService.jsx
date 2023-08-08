import jwtDecode from "jwt-decode";
import HttpService from "./httpService";
import env from "../env";

const itemName = "authtoken";
HttpService.setJwt(getCurrentJwt());

// posts a login and then stores in local storage
export async function login(user, password) {
  const credentials = {
    email: user,
    password: password
  };

  const { data: token } = await HttpService.post(
    `${env.reflectionsApiUrl()}auth`,
    credentials
  );
  localStorage.setItem(itemName, token);

  HttpService.setJwt(token);
}

export async function logout() {
  localStorage.removeItem(itemName);
}

export function getCurrentJwt() {
  return localStorage.getItem(itemName);
}

export function getCurrentUser() {
  try {
    return jwtDecode(getCurrentJwt());
  } catch (ex) {
    return null; // null means anonymous login
  }
}

const authService = {
  login,
  logout,
  getCurrentJwt,
  getCurrentUser
};
export default authService;
