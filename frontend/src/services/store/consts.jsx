import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_BASE_URL,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("token");
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

export const urls = {
    auth: {
        register: 'auth/register',
        login: 'auth/login',
        logout: 'auth/logout',
        verify2fa: 'auth/2fa/verify',
    },
    surveys: {
        surveys: 'surveys',
        my: 'surveys/my',
        myAll: 'surveys/my-all',
        images: 'surveys/images',
    },
    messages: {
        messages: 'messages',
    },
    vote: {
        vote: "/vote",
        advanced: "/vote/advanced",
        values: (surveyId) => `/vote/${surveyId}/values`
    },
    grantAdmin: 'users/grant-admin',
};