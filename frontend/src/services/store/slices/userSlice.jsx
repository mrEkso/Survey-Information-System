import {createSlice} from '@reduxjs/toolkit'
import {authApi} from "src/services/store/api/authApi.jsx";

const slice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        isAuth: false,
        token: localStorage.getItem('token') || null,
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

export const {register, login, logout} = slice.actions
export default slice.reducer

export const selectUser = (state) => state.user.user
export const selectIsAuth = (state) => state.user.isAuth