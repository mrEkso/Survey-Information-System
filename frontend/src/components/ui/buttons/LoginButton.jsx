import {Box, Menu, Stack, TextField, Tooltip} from "@mui/material";
import PropTypes from "prop-types";
import {useState} from "react";
import {SecondaryButton} from "@components/ui/buttons/SecondaryButton";
import {PrimaryButton} from "@components/ui/buttons/PrimaryButton.jsx";
import {useLoginMutation} from "src/services/store/api/authApi.jsx";
import {useDispatch, useSelector} from "react-redux";
import {selectIsAuth, selectUser} from "src/services/store/slices/userSlice.jsx";

export const LoginButton = ({children}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loginForm, setLoginForm] = useState(null);
    const [login] = useLoginMutation();
    const dispatch = useDispatch();
    const isAuth = useSelector(selectIsAuth);
    const user = useSelector(selectUser);

    const handleLogin = async () => {
        try {
            dispatch(await login({email, password}))
        } catch (error) {
            console.log(error)
        }
    };

    const handleOpenLoginMenu = (event) => {
        setLoginForm(event.currentTarget);
    };
    const handleCloseLoginMenu = () => {
        setLoginForm(null);
    };

    return (<Box sx={{flexGrow: 0}}>
        <Tooltip title="Open login form">
            <SecondaryButton onClick={handleOpenLoginMenu}
            >{children}</SecondaryButton>
        </Tooltip>
        <Menu
            sx={{mt: '45px'}}
            id="menu-appbar"
            anchorEl={loginForm}
            anchorOrigin={{
                vertical: 'top', horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top', horizontal: 'right',
            }}
            open={Boolean(loginForm)}
            onClose={handleCloseLoginMenu}
        >
            <Stack spacing={2} padding={2}>
                <TextField variant={"standard"} onChange={e => setEmail(e.target.value)} label="Email"
                           sx={{color: 'gold.main'}}/>
                <TextField variant={"standard"} onChange={e => setPassword(e.target.value)} label="Password"
                           type="password"/>
                <PrimaryButton onClick={handleLogin}>
                    Login
                </PrimaryButton>
            </Stack>
        </Menu>
    </Box>)
}

LoginButton.propTypes = {
    children: PropTypes.string
};
