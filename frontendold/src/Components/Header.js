import React from "react"
import PollIcon from "@mui/icons-material/PollOutlined";
import AuthorizationButtonGroup from "./ui/AuthorizationButtonGroup";
import {AppBar, Container, Toolbar, Typography} from "@mui/material";

export default function Header() {
    return (
        <header>
            <Container>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h5">
                            Online Survey System
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Container>
        </header>
        // <div className="row">
        //     <div className="col-3">
        //         <div className="logo">
        //             <img src="./images/logo.png" alt="logo"/>
        //         </div>
        //     </div>
        //     <div className="col-4 offset-1 mt-4">
        //         <div className="row justify-content-center">
        //             <PollIcon fontSize="large"/>
        //             <h2 className="icon-animation clickable ml-2">
        //                 Online Survey System</h2>
        //         </div>
        //     </div>
        //     <div className="col-3 offset-1 mt-4">
        //         <AuthorizationButtonGroup/>
        //     </div>
        // </div>
    )
}
