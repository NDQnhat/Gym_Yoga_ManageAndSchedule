import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { User } from "../../types/user.type";
import { apis } from "../../apis";
import type { FormSignup } from "../../auth/Register";
import type { FormSignin } from "../../auth/Login";

interface UserState {
  data: User | null | User[];
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
      .addCase(fetchUsersData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsersData.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchUsersData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.loading = false;
      })
  },
});

export const fetchUsersData = createAsyncThunk("users/fetchData", async () => {
  let result = await apis.userApi.getAllUsers();
  return result;
});

export const postUser = createAsyncThunk("user/postUser", async (data: FormSignup) => {
  let result = await apis.userApi.registerUser(data);
  return result;
});

export const checkSigninData = createAsyncThunk("users/checkSigninData", async (data: FormSignin) => {
  let result = await apis.userApi.loginUser(data);
  return result;
});

export const deleteUser = createAsyncThunk("DELETE/users", async (id: string) => {
  await apis.userApi.removeUser(id);
}); 

export const updateUser = createAsyncThunk<void, {id: string, newData: User}>("PATCH/courses", async ({id, newData}) => {
  await apis.userApi.updateUser(id, newData);
});

export const userThunkReducer = userThunk.reducer;
export const userThunkAction = userThunk.actions;
