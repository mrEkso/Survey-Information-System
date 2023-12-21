import {urls} from "src/services/store/consts.jsx";
import {api} from "src/services/store/api.jsx";

export const authApi = api.injectEndpoints({
    endpoints: builder => ({
        register: builder.mutation({
            query: (data) => ({
                url: urls.auth.register, method: 'POST', body: data
            }),
        }), login: builder.mutation({
            query: (data) => ({
                url: urls.auth.login, method: 'POST', body: data
            })
        }), logout: builder.query({
            query: (id) => ({
                url: `${urls.auth.logout}/${id}`
            }),
        }),
    }),
})

export const {useRegisterMutation, useLoginMutation, useLogoutQuery} = authApi
export const {endpoints: {register, login, logout}} = authApi