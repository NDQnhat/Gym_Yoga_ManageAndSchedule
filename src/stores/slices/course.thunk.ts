import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apis } from "../../apis";
import type { Course } from "../../types/course.type";

interface CourseState {
    data: Course[],
    loading: boolean,
    error: string,
}

const initialState: CourseState = {
    data: [],
    loading: false,
    error: "",
}

export const courseThunk = createSlice({
    name: "courseThunk",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
        .addCase(getCourses.pending, (state) => {
            state.loading = true;
        })
        .addCase(getCourses.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(getCourses.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Error!!";
        })
    },
})

export const getCourses = createAsyncThunk("fetchCoursesData", async () => {
    let result = await apis.courseApi.getAllCourse();
    return result;
});

export const courseThunkReducer = courseThunk.reducer;
export const courseThunkAction = courseThunk.actions;