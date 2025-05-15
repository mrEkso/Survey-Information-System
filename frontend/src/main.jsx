import { CssBaseline, ThemeProvider } from "@mui/material";
import { DevSupport } from "@react-buddy/ide-toolbox";
import { SnackbarProvider } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from "react-router-dom";
import { ComponentPreviews, useInitial } from "src/dev/index.js";
import { router } from "src/router/index.jsx";
import { store } from "src/services/store/index.jsx";
import './assets/css/responsive.css';
import { theme } from "./theme";

const setViewportMeta = () => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
    } else {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
        document.head.appendChild(meta);
    }
};

setViewportMeta();

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider maxSnack={5} anchorOrigin={{
                vertical: window.innerWidth < 480 ? 'top' : 'bottom',
                horizontal: 'center'
            }}>
                <DevSupport ComponentPreviews={ComponentPreviews}
                    useInitialHook={useInitial}
                >
                    <Provider store={store}>
                        <RouterProvider router={router} future={{ v7_startTransition: true, v7_relativeSplatPath: true }} />
                    </Provider>
                </DevSupport>
            </SnackbarProvider>
        </ThemeProvider>
    </React.StrictMode>
)
