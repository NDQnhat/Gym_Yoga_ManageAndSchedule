import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Bookings } from "../../types/bookings.type";
import { apis } from "../../apis";

interface BookingState {
  data: Bookings[];
  loading: boolean;
  error: string;
}

const initialState: BookingState = {
  data: [],
  loading: false,
  error: "",
};

export const bookingsThunk = createSlice({
    name: "bookingThunks",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
        .addCase(getBookings.pending, (state) => {
            state.loading = true;
        })
        .addCase(getBookings.fulfilled, (state, action) => {
            state.data = action.payload;
            state.loading = false;
            state.error = "";
        })
        .addCase(getBookings.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Có lỗi xảy ra!";
        })
    }
});

export const getBookings = createAsyncThunk<Bookings[], string>("fetchBookingsData", async (id) => {
    let res = await apis.bookingsApi.getUserBookings(id);
    return res;
});

export const bookingsThunkReducer = bookingsThunk.reducer;
export const bookingsThunkAction = bookingsThunk.actions;
