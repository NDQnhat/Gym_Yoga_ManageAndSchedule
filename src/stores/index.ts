import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { userThunkReducer } from "./slices/user.thunk";
import { userReducer } from "./slices/user.slice";

const RootReducer = combineReducers({
    userThunk: userThunkReducer,
    user: userReducer,
});

export const myStore = configureStore({
    reducer: RootReducer,
});

export type StoreType = ReturnType<typeof RootReducer>
export type AppDispatch = typeof myStore.dispatch;