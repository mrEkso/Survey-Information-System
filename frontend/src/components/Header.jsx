import {AppBar, Toolbar} from "@mui/material";
import {ComponentBox} from "@components/ui/boxes/ComponentBox.jsx";
import {LogoIcon} from "@components/ui/icons/LogoIcon.jsx";
import {LoginButton} from "@components/ui/buttons/LoginButton.jsx";
import {SecondaryButton} from "@components/ui/buttons/SecondaryButton";
import {BoldTypography} from "@components/ui/typographies/BoldTypography.jsx";
import {LogoTypography} from "@components/ui/typographies/LogoTypography";
import {useDispatch} from "react-redux";

export default function Header() {
    const {user, isAuth} = useDispatch()

    return (<header>
        <AppBar position="static">
            <Toolbar sx={{justifyContent: "space-between"}}>
                <LogoTypography flex={1} mr={3}/>
                <ComponentBox component={LogoIcon} flex={1}/>
                {isAuth ? (<><BoldTypography mr={2}>{user.email}</BoldTypography>
                    <SecondaryButton>My Surveys</SecondaryButton></>) : <LoginButton>Log in</LoginButton>}
            </Toolbar>
        </AppBar>
    </header>)
}
