import {configureStore} from '@reduxjs/toolkit'
import user from "@services/store/slices/userSlice";
import surveys from "@services/store/slices/surveysSlice";
import {setupListeners} from "@reduxjs/toolkit/query";
import {api} from "@services/store/api";
import {listenerMiddleware} from "@services/middleware/auth";

export const store = configureStore({
    reducer: {
        user: user,
        surveys: surveys,
        [api.reducerPath]: api.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware).prepend(listenerMiddleware.middleware),
})

setupListeners(store.dispatch)

