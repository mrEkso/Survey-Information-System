import {Box, Menu, Stack, TextField, Tooltip} from "@mui/material";
import PropTypes from "prop-types";
import {useState} from "react";
import {SecondaryButton} from "@components/ui/buttons/SecondaryButton";
import {PrimaryButton} from "@components/ui/buttons/PrimaryButton.jsx";
import {useLoginMutation} from "src/services/store/api/authApi.jsx";
import {useDispatch} from "react-redux";

export const LoginButton = ({children}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loginForm, setLoginForm] = useState(null);
    const [login] = useLoginMutation();
    const {user, isAuth} = useDispatch();

    const handleLogin = async () => {
        console.log(user + ' ' + isAuth)
        try {
            login({email, password})
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
                <TextField variant={"standard"} onChange={e => setEmail(e.target.value)} label="Username"
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
