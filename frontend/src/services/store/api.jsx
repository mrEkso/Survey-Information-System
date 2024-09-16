import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQuery} from "@services/store/consts";

export const api = createApi({
    reducerPath: 'authApi', tagTypes: [],
    baseQuery: baseQuery,
    refetchOnMountOrArgChange: true, endpoints: () => ({}),
});