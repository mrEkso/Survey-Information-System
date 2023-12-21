import {createSlice} from '@reduxjs/toolkit'
import {authApi} from "src/services/store/api/authApi.jsx";

const slice = createSlice({
    name: 'user', initialState: {
        user: null, isAuth: false,
    }, reducers: {
        logout: () => {
            return {
                user: null, isAuth: false,
            }
        },
    }, extraReducer: (builder) => {
        builder
            .addMatcher(authApi.endpoints.register.matchFulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuth = true;
            })
            .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuth = true;
            })
    }
})

export const {register, login, logout} = slice.actions
export default slice.reducer

export const selectUser = (state) => state.user.user
export const selectIsAuth = (state) => state.user.isAuth