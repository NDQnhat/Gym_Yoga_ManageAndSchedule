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
        .addCase(makeNewCourses.pending, (state) => {
            state.loading = true;
        })
        .addCase(makeNewCourses.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(makeNewCourses.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Error!!";
        })
        .addCase(getAllCourses.pending, (state) => {
            state.loading = true;
        })
        .addCase(getAllCourses.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(getAllCourses.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Error!!";
        })
    },
})

export const getCourses = createAsyncThunk("fetchCoursesData", async () => {
    let result = await apis.courseApi.getAllCourse();
    return result;
});

export const makeNewCourses = createAsyncThunk("postNewCourses", async (data: Course) => {
    let res = await apis.courseApi.postNewCourses(data);
    return res;
});

export const getAllCourses = createAsyncThunk("GET/courses", async () => {
    let res = await apis.courseApi.getAllCourse();
    return res;
});

export const deleteCourse = createAsyncThunk("DELETE/courses", async (id: string) => {
    await apis.courseApi.removeCourse(id);
});

export const updateCourse = createAsyncThunk<void, {id: string, newData: Course}>("PATCH/courses", async ({id, newData}) => {
    await apis.courseApi.updateCourse(id, newData);
});

export const courseThunkReducer = courseThunk.reducer;
export const courseThunkAction = courseThunk.actions;