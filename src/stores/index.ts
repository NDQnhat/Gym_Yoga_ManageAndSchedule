import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { userThunkReducer } from "./slices/user.thunk";
import { userReducer } from "./slices/user.slice";
import { courseThunkReducer } from "./slices/course.thunk";
import { bookingsThunkReducer } from "./slices/bookings.thunk";

const RootReducer = combineReducers({
    userThunk: userThunkReducer,
    user: userReducer,
    courseThunk: courseThunkReducer,
    bookingsThunk: bookingsThunkReducer,
});

export const myStore = configureStore({
    reducer: RootReducer,
});

export type StoreType = ReturnType<typeof RootReducer>
export type AppDispatch = typeof myStore.dispatch;