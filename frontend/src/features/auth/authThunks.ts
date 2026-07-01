import { createAsyncThunk } from "@reduxjs/toolkit";
import type { LoginRequest, SignupRequest } from "./authTypes";
import { login, refresh, signup } from "../../api/auth.api";
import axios from "axios";

export const signupUser = createAsyncThunk(
  "auth/signup",
  async (data: SignupRequest) => {
    const response = await signup(data);
    return response.data;
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await login(data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message ?? "Login failed"
        );
      }

      return rejectWithValue("Something went wrong");
    }
  }
);

export const generateNewAccessToken = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const response = await refresh();
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message ?? "Generating new access token failed"
        );
      }

      return rejectWithValue("Something went wrong");
    }
  }
)