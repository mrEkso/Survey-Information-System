import {fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_BASE_URL, prepareHeaders: (headers) => {
        const token = localStorage.getItem("token");
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

export const urls = {
    auth: {
        register: 'auth/register', login: 'auth/login', logout: 'auth/logout',
    }, surveys: {
        surveys: 'surveys',
    },
};