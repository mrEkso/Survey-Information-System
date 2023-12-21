import {AppBar, Toolbar} from "@mui/material";
import {ComponentBox} from "@components/ui/boxes/ComponentBox.jsx";
import {LogoIcon} from "@components/ui/icons/LogoIcon.jsx";
import {LoginButton} from "@components/ui/buttons/LoginButton.jsx";
import {SecondaryButton} from "@components/ui/buttons/SecondaryButton";
import {useState} from "react";
import {BoldTypography} from "@components/ui/Typographies/BoldTypography.jsx";
import {LogoTypography} from "@components/ui/Typographies/LogoTypography";

export default function Header() {
    const {user, setUser} = useState()

    const getUser = () => {
        setUser(localStorage.getItem("user"));
    }

    return (<header>
        <AppBar position="static">
            <Toolbar sx={{justifyContent: "space-between"}}>
                <LogoTypography flex={1} mr={3}/>
                <ComponentBox component={LogoIcon} flex={1}/>
                {user ? (<><BoldTypography>{user ? user.email : "david@gmail.com"}</BoldTypography>
                    <SecondaryButton>My Surveys</SecondaryButton></>) : <LoginButton>Log in</LoginButton>}
            </Toolbar>
        </AppBar>
    </header>)
}
