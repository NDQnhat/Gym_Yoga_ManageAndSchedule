import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  role: "",
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.data = action.payload;
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.data = null;
      state.role = "";
    },
  },
});

export const userReducer = userSlice.reducer;
export const userAction = userSlice.actions;
