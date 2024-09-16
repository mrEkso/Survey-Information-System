import {fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_BASE_URL, prepareHeaders: (headers) => {
        const token = localStorage.getItem("token");
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
            headers.set("Content-Type", "application/json");
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