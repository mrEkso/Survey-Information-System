import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQuery} from "src/services/store/consts.jsx";

export const api = createApi({
    reducerPath: 'authApi', tagTypes: [],
    baseQuery: baseQuery,
    refetchOnMountOrArgChange: true, endpoints: () => ({}),
});