import {AppBar, Box, Toolbar, Typography} from "@mui/material";

export default function Footer(props) {
    return (<header>
        <Box {...props}>
            <AppBar position="static">
                <Toolbar>
                    <Typography>@Davyd Okaianchenko</Typography>
                </Toolbar>
            </AppBar>
        </Box>
    </header>)
}
