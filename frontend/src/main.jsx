import React from 'react'
import ReactDOM from 'react-dom/client'
import {ThemeProvider} from "@mui/material";
import {theme} from "./theme";
import {SnackbarProvider} from 'notistack';
import {DevSupport} from "@react-buddy/ide-toolbox";
import {ComponentPreviews, useInitial} from "src/dev/index.js";
import {RouterProvider} from "react-router-dom";
import {router} from "src/router/index.jsx";
import {Provider} from 'react-redux'
import {store} from "src/services/store/index.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={5} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
                <DevSupport ComponentPreviews={ComponentPreviews}
                            useInitialHook={useInitial}
                >
                    <Provider store={store}>
                        <RouterProvider router={router}/>
                    </Provider>
                </DevSupport>
            </SnackbarProvider>
        </ThemeProvider>
    </React.StrictMode>
)
