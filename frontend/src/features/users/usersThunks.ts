import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import axiosApi from "../../axiosApi.ts";
import type { GlobalError, LoginMutation, RegisterMutation, User, ValidationError } from "../../types";

export interface RegisterAndLoginResponse {
  user: User;
  message: string;
}

export const register = createAsyncThunk<
  RegisterAndLoginResponse,
  RegisterMutation,
  { rejectValue: ValidationError }
>("users/register", async (registerForm, { rejectWithValue }) => {
  try {
    const response = await axiosApi.post<RegisterAndLoginResponse>(
      "/users",
      registerForm,
    );
    return response.data;
  } catch (error) {
    if (
      isAxiosError(error) &&
      error.response &&
      error.response.status === 400
    ) {
      return rejectWithValue(error.response.data);
    }

    throw error;
  }
});

export const login = createAsyncThunk<
  User,
  LoginMutation,
  { rejectValue: GlobalError }
>("users/login", async (loginForm, { rejectWithValue }) => {
  try {
    const response = await axiosApi.post<RegisterAndLoginResponse>(
      "/users/sessions",
      loginForm,
    );
    return response.data.user;
  } catch (error) {
    if (
      isAxiosError(error) &&
      error.response &&
      error.response.status === 400
    ) {
      return rejectWithValue(error.response.data);
    }

    throw error;
  }
});

export const logout = createAsyncThunk<void, void>("users/logout", async () => {
  await axiosApi.delete("users/sessions", { withCredentials: true });
});
