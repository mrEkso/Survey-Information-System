import { createSlice } from '@reduxjs/toolkit'
import { authApi } from "src/services/store/api/authApi.jsx";

const slice = createSlice({
    name: 'user',
    initialState: {
        // TODO: remove this
        user: {
            id: "22222222-2222-2222-2222-222222222222",
            username: "test",
            email: "test@gmail.com"
        },
        isAuth: true,
        token: "***REMOVED_JWT_TOKEN***",
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addMatcher(authApi.endpoints.register.matchFulfilled, (state, action) => {
                state.user = action.payload.data;
                state.isAuth = true;
                state.token = action.payload.token;
            })
            .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
                state.user = action.payload.data;
                state.isAuth = true;
                state.token = action.payload.token;
            })
            .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
                state.user = null;
                state.isAuth = false;
                state.token = null;
                localStorage.removeItem('token');
            })
    }
})

export const { register, login, logout } = slice.actions
export default slice.reducer

export const selectUser = (state) => state.user.user
export const selectIsAuth = (state) => state.user.isAuth