import api from "./axios";
import type { LoginRequest, LoginResponse, SignupRequest } from "../features/auth/authTypes";

export const signup = (data: SignupRequest) =>
  api.post("/auth/signup", data);

export const login = (data: LoginRequest) =>
  api.post<LoginResponse>("/auth/login", data);

export const refresh = () =>
  api.post<LoginResponse>("auth/refresh");