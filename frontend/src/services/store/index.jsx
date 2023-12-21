import {configureStore} from '@reduxjs/toolkit'
import user from "src/services/store/slices/userSlice.jsx";
import surveys from "src/services/store/slices/surveysSlice.jsx";
import {setupListeners} from "@reduxjs/toolkit/query";
import {api} from "src/services/store/api.jsx";
import {listenerMiddleware} from "src/services/middleware/auth.jsx";

export const store = configureStore({
    reducer: {
        user, surveys, [api.reducerPath]: api.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware).prepend(listenerMiddleware.middleware),
})

setupListeners(store.dispatch)

