import { api } from "@services/store/api";
import { urls } from "@services/store/consts";

export const userApi = api.injectEndpoints({
    endpoints: builder => ({
        grantAdmin: builder.mutation({
            query: (email) => ({
                url: urls.grantAdmin,
                method: 'POST',
                body: { email },
            }),
        }),
        enable2fa: builder.mutation({
            query: () => ({
                url: 'users/2fa/enable',
                method: 'POST',
            }),
        }),
        verify2faUser: builder.mutation({
            query: (code) => ({
                url: 'users/2fa/verify',
                method: 'POST',
                params: { code },
            }),
        }),
    }),
});

export const { useGrantAdminMutation, useEnable2faMutation, useVerify2faUserMutation } = userApi; 