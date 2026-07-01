import { createSlice } from "@reduxjs/toolkit";
import { generateNewAccessToken, loginUser, signupUser } from "./authThunks";

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  initialized: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,
  initialized: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
    },

    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      // ---------- SIGNUP ----------

      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ---------- LOGIN ----------

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(generateNewAccessToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(generateNewAccessToken.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;

        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
      })

      .addCase(generateNewAccessToken.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;

        state.isAuthenticated = false;
        state.accessToken = null;
        state.user = null;
        state.error = action.payload as string;
      })
  },
});

export const { logout, setAccessToken } = authSlice.actions;

export default authSlice.reducer;