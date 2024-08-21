import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { createSlice } from "@reduxjs/toolkit";
import { takeLatest } from "redux-saga/effects";

interface AuthState {
  auth: null | {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  isSessionExpired: boolean;
  token: string | null;
}
const initialAuthState: AuthState = {
  auth: null,
  isSessionExpired: false,
  token: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login: (state, action) => ({
      ...state,
      auth: action.payload,
      token: null,
    }),
    logout: () => initialAuthState,
    sessionExpired: (state) => ({ ...state, isSessionExpired: true }),
    updateAuth: (state, action) => ({
      ...state,
      auth: {
        ...(state.auth || {}),
        ...action.payload,
      },
    }),
    setToken: (state, action) => ({
      ...state,
      token: action.payload,
    }),
  },
});
export const authActions = authSlice.actions;
export const authReducer = persistReducer(
  { storage, key: "auth", whitelist: ["auth", "token"] },
  authSlice.reducer,
);
export const authSaga = function* () {
  yield takeLatest(authActions.logout, function* () {});
};
