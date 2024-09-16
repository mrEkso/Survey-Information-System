import {Box, Menu, Stack, TextField, Tooltip} from "@mui/material";
import PropTypes from "prop-types";
import {useState} from "react";
import {SecondaryButton} from "@components/ui/buttons/SecondaryButton";
import {PrimaryButton} from "@components/ui/buttons/PrimaryButton.jsx";
import {useRegisterMutation} from "src/services/store/api/authApi.jsx";
import useTopSnackbar from "@components/ui/snackbars/TopSnackbar.jsx";

export const RegisterButton = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [registerForm, setRegisterForm] = useState(null);
    const [register] = useRegisterMutation();
    const snackbar = useTopSnackbar();

    const handleRegister = async () => {
        try {
            const {error, data} = await register({username, email, password});
            let messages = [];

            if (error) {
                if (error.data.errors) {
                    messages = error.data.errors.map(err => `${err.field}: ${err.message}`);
                } else {
                    messages = [error.data.message];
                }
            } else {
                messages = [data.message];
            }

            messages.forEach(message => snackbar(message, error ? "error" : "success"));
            console.log(error || data);
        } catch (error) {
            console.log(error)
        }
    };

    const handleOpenRegisterMenu = (event) => {
        setRegisterForm(event.currentTarget);
    };
    const handleCloseRegisterMenu = () => {
        setRegisterForm(null);
    };

    return (<Box sx={{flexGrow: 0}}>
        <Tooltip title="Open Register form">
            <SecondaryButton onClick={handleOpenRegisterMenu}
            >Register</SecondaryButton>
        </Tooltip>
        <Menu
            sx={{mt: '45px'}}
            id="menu-appbar"
            anchorEl={registerForm}
            anchorOrigin={{
                vertical: 'top', horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top', horizontal: 'right',
            }}
            open={Boolean(registerForm)}
            onClose={handleCloseRegisterMenu}
        >
            <Stack spacing={2} padding={2}>
                <TextField variant={"standard"} onChange={e => setUsername(e.target.value)} label="Username"
                           sx={{color: 'gold.main'}}/>
                <TextField variant={"standard"} onChange={e => setEmail(e.target.value)} label="Email"
                           sx={{color: 'gold.main'}}/>
                <TextField variant={"standard"} onChange={e => setPassword(e.target.value)} label="Password"
                           type="password"/>
                <PrimaryButton onClick={handleRegister}>
                    Register
                </PrimaryButton>
            </Stack>
        </Menu>
    </Box>)
}
