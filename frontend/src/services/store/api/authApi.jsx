import { api } from "@services/store/api";
import { urls } from "@services/store/consts";

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
        verify2fa: builder.mutation({
            query: ({ token, code }) => ({
                url: urls.auth.verify2fa, method: 'POST', body: { token, code }
            })
        }),
        getMe: builder.query({
            query: () => ({
                url: 'users/me', method: 'GET'
            })
        }),
    }),
})

export const { useRegisterMutation, useLoginMutation, useLogoutMutation, useVerify2faMutation, useGetMeQuery } = authApi
export const { endpoints: { register, login, logout } } = authApi