import {urls} from "@services/store/consts";
import {api} from "@services/store/api";

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
        }), logout: builder.mutation({
            query: () => ({
                url: `${urls.auth.logout}`, method: 'POST'
            }),
        }),
    }),
})

export const {useRegisterMutation, useLoginMutation, useLogoutMutation} = authApi
export const {endpoints: {register, login, logout}} = authApi