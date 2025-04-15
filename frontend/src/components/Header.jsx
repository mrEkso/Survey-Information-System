import { AppBar, Toolbar } from "@mui/material";
import { ComponentBox } from "@components/ui/boxes/ComponentBox.jsx";
import { LogoIcon } from "@components/ui/icons/LogoIcon.jsx";
import { LoginButton } from "@components/ui/buttons/LoginButton.jsx";
import { SecondaryButton } from "@components/ui/buttons/SecondaryButton";
import { BoldTypography } from "@components/ui/typographies/BoldTypography.jsx";
import { LogoTypography } from "@components/ui/typographies/LogoTypography";
import { useSelector } from "react-redux";
import { selectIsAuth, selectUser } from "src/services/store/slices/userSlice.jsx";
import { LogoutButton } from "@components/ui/buttons/LogoutButton.jsx";
import { RegisterButton } from "@components/ui/buttons/RegisterButton.jsx";
import { Link } from "react-router-dom";

export default function Header() {
    const user = useSelector(selectUser);
    const isAuth = useSelector(selectIsAuth);

    return (<header>
        <AppBar position="static">
            <Toolbar sx={{ justifyContent: "space-between" }}>
                <LogoTypography mr={3} />
                <ComponentBox flex={1} component={LogoIcon} />
                {isAuth ? (<BoldTypography mr={2}>{user.email}</BoldTypography>) :
                    <LoginButton mr={2}></LoginButton>}
                {isAuth ? (
                    <>
                        <SecondaryButton component={Link} to="/my-surveys">
                            My Surveys
                        </SecondaryButton>
                        <LogoutButton></LogoutButton>
                    </>
                ) : <RegisterButton></RegisterButton>}
            </Toolbar>
        </AppBar>
    </header>)
}
