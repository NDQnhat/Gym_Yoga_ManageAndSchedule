import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { User } from "../user.type";

interface UserState {
  data: User | null;
  loading: boolean;
}

const initialState = {
  user: null,
  loading: false,
};

export const userSlice = createSlice({
  name: "user",
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
  },
});

const fetchUserData = createAsyncThunk(
    "user/fetchUserData",
    async () => {
        // let result = await Apis.user.findById(localStorage.getItem("userLogin"))
        // return result.data
    }
)

export default userSlice.reducer;
