import React from "react"
import {Link} from 'react-router-dom';
import {Button, ButtonGroup} from "@mui/material";

function AuthorizationButtonGroup() {
    return (
        <div className="nav navbar justify-content-end">
            <ButtonGroup size="large" variant="contained" aria-label="outlined primary button group">
                <Button component={Link} to="/login" variant="outlined">login</Button>
                <Button component={Link} to="/register" variant="outlined">register</Button>
            </ButtonGroup>
        </div>
    )
}

export default AuthorizationButtonGroup;