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
        .addCase(makeNewBookings.pending, (state) => {
            state.loading = true;
        })
        .addCase(makeNewBookings.fulfilled, (state, action) => {
            state.loading = false;
            // state.data.push(action.payload);
            state.data = action.payload;
        })
        .addCase(makeNewBookings.rejected, (state) => {
            state.loading = false;
        })
        .addCase(deleteBookings.pending, (state) => {
            state.loading = true;
        })
        .addCase(deleteBookings.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(deleteBookings.rejected, (state) => {
            state.loading = false;
        })
    }
});

export const getBookings = createAsyncThunk<Bookings[], {id: string, currentPage: number, perPage: number}>("fetchBookingsData", async ({id, currentPage, perPage}) => {
    let res = await apis.bookingsApi.getUserBookings(id, currentPage, perPage);
    return res;
});

export const makeNewBookings = createAsyncThunk("postNewBookings", async (data: Bookings) => {
    let res = await apis.bookingsApi.postNewBookings(data);
    return res;
});

export const deleteBookings = createAsyncThunk("bookings/delete", async (id: string) => {
    await apis.bookingsApi.removeBookings(id);
});

export const bookingsThunkReducer = bookingsThunk.reducer;
export const bookingsThunkAction = bookingsThunk.actions;
