import {createListenerMiddleware} from "@reduxjs/toolkit";
import {authApi} from "src/services/store/api/authApi.jsx";

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
    matcher: authApi.endpoints.login.matchFulfilled, effect: async (action, listenerApi) => {
        listenerApi.cancelActiveListeners();
        if (action.payload.token) {
            localStorage.setItem('token', action.payload.token);
        }
    }
})