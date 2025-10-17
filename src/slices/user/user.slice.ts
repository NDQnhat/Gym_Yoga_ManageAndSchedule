import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    status: 'idle',
    error: '',
};

export const registerUser = createAsyncThunk(
    'user/register',
    async (userDetails) => {
        let { email, name, password, rePass } = userDetails;
        if (!email || !name || !password || !rePass) {
            throw new Error('All fields are required!');
        }
        if(password !== rePass) {
            throw new Error('Passwords must match!');
        }

        const user = await register(userDetails);
        return user;
    }
);

export const loginUser = createAsyncThunk(
    'user/login',
    async (userDetails) => {
        if(!userDetails?.email || !userDetails?.password) {
            throw new Error('All fields are required!');
        }

        const user = await login(userDetails);
        return user;
    }
);

export const logoutUser = createAsyncThunk(
    'user/logout',
    async () => {
        await logout();
        return true;
    }
);

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        removeUserError: state => {
            state.status = state.user !== null ? 'succeeded' : 'idle'; 
            state.error = '';
        }
    },
    extraReducers: builder => {
        builder
            .addCase(registerUser.pending, state => {
                state.status = 'loading';
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.error.message || '';
            });

        builder
            .addCase(loginUser.pending, state => {
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'error';
                state.error = 'Invalid credentials!';
            });

        builder
            .addCase(logoutUser.fulfilled, (state, action) => {
                if (action.payload) {
                    console.log(`>>> logged out`, state);
                    state.user = null;
                }
            });
    }
});

export const selectUserId = state => {
    return state.user.status === 'succeeded'
        ? state.user.user._id
        : undefined;
};

export const selectUser = state => {
    return state.user.status === 'succeeded'
        ? state.user.user
        : undefined;
};

export const  removeUserError  = userSlice.actions;
export default userSlice.reducer;