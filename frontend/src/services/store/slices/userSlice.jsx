import { createSlice } from '@reduxjs/toolkit';
import { authApi } from "src/services/store/api/authApi.jsx";

const slice = createSlice({
    name: 'user',
    initialState: {
        // Default values
        user: null,
        isAuth: false,
        token: localStorage.getItem('token') || null,
        // TODO: remove this
        //// admin
        // user: {
        //     id: "11111111-1111-1111-1111-111111111111",
        //     nickname: "baron",
        //     email: "bar@gmail.com",
        //     role: 1
        // },
        // isAuth: true,
        // token: "***REMOVED_JWT_TOKEN***",
        //// user
        // user: {
        //     id: "22222222-2222-2222-2222-222222222222",
        //     nickname: "test",
        //     email: "test@gmail.com",
        //     role: 2
        // },
        // isAuth: true,
        // token: "***REMOVED_JWT_TOKEN***",
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuth = action.payload.isAuth;
            if (action.payload.token) {
                localStorage.setItem('token', action.payload.token);
            } else {
                localStorage.removeItem('token');
            }
        },
        logout: (state) => {
            state.user = null;
            state.isAuth = false;
            state.token = null;
            localStorage.removeItem('token');
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(authApi.endpoints.register.matchFulfilled, (state, action) => {
                // Register endpoint returns user data and 2FA token
                state.user = action.payload.data;
                state.isAuth = false;
                state.token = null;
            })
            .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
                // If twoFaRequired, don't authorize user, don't save token
                if (action.payload.twoFaRequired) {
                    state.user = action.payload.data;
                    state.isAuth = false;
                    state.token = null;
                } else {
                    state.user = action.payload.data;
                    state.isAuth = true;
                    state.token = action.payload.token;
                    localStorage.setItem('token', action.payload.token);
                }
            })
            .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
                state.user = null;
                state.isAuth = false;
                state.token = null;
                localStorage.removeItem('token');
            })
            // После успешной верификации 2FA авторизуем пользователя
            .addMatcher(authApi.endpoints.verify2fa.matchFulfilled, (state, action) => {
                state.user = action.payload.data;
                state.isAuth = true;
                state.token = action.payload.token;
            })
    }
})

export const { register, login, logout, setUser } = slice.actions
export default slice.reducer

export const selectUser = (state) => state.user.user
export const selectIsAuth = (state) => state.user.isAuth
export const selectIsAdmin = (state) => state.user.isAuth && state.user.user && state.user.user.role === 1 // ROLE_ADMIN
export const selectIsOwner = (state, userId) => state.user.user && state.user.user.id === userId;