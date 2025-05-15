import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from "@reduxjs/toolkit/query";
import { listenerMiddleware } from "@services/middleware/auth";
import { api } from "@services/store/api";
import { messageApi } from "@services/store/api/messageApi";
import surveys from "@services/store/slices/surveysSlice";
import user from "@services/store/slices/userSlice";

export const store = configureStore({
    reducer: {
        user: user,
        surveys: surveys,
        [api.reducerPath]: api.reducer,
        [messageApi.reducerPath]: messageApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(api.middleware, messageApi.middleware)
            .prepend(listenerMiddleware.middleware),
})

setupListeners(store.dispatch)

