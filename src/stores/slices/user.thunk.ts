import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { User } from "../../types/user.type";
import { apis } from "../../apis";
import type { FormSignup } from "../../auth/Register";
import type { FormSignin } from "../../auth/Login";

interface UserState {
  data: User | null;
  loading: boolean;
  error: string;
}

const initialState = {
  user: null,
  loading: false,
  error: "",
};

export const userThunk = createSlice({
  name: "userThunk",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        // state.user = action.payload;
      })
      // .addCase(fetchUserData.rejected, (state, action) => {
      // });
      .addCase(postUser.pending, (state) => {
        state.loading = true;
        state.user = null;
      })
      .addCase(postUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(postUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Fail to Sign up!!";
      })
      .addCase(checkSigninData.pending, (state) => {
        state.loading = true;
        state.user = null;
      })
      .addCase(checkSigninData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(checkSigninData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Fail to Sign in!!";
      })
  },
});

const fetchUserData = createAsyncThunk("user/fetchUserData", async () => {
  // let result = await Apis.user.findById(localStorage.getItem("userLogin"))
  // return result.data
});

export const postUser = createAsyncThunk("user/postUser", async (data: FormSignup) => {
  let result = await apis.userApi.registerUser(data);
  return result;
});

export const checkSigninData = createAsyncThunk("users/checkSigninData", async (data: FormSignin) => {
  let result = await apis.userApi.loginUser(data);
  return result;
});

export const userThunkReducer = userThunk.reducer;
export const userAction = userThunk.actions;
