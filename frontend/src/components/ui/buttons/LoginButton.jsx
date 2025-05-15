import { PrimaryButton } from "@components/ui/buttons/PrimaryButton.jsx";
import { SecondaryButton } from "@components/ui/buttons/SecondaryButton";
import useTopSnackbar from "@components/ui/snackbars/TopSnackbar.jsx";
import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Modal, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { useLoginMutation, useVerify2faMutation } from "@services/store/api/authApi.jsx";
import { useState } from "react";

export const LoginButton = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [login] = useLoginMutation();
    const [verify2fa] = useVerify2faMutation();
    const [twoFaRequired, setTwoFaRequired] = useState(false);
    const [twoFaToken, setTwoFaToken] = useState('');
    const [twoFaCode, setTwoFaCode] = useState('');
    const snackbar = useTopSnackbar();

    const handleLogin = async () => {
        try {
            const { error, data } = await login({ email, password });
            let messages = [];

            if (error) {
                if (error.data.errors) {
                    messages = error.data.errors.map(err => `${err.field}: ${err.message}`);
                } else {
                    messages = [error.data.message];
                }
            } else {
                if (data.twoFaRequired) {
                    setTwoFaRequired(true);
                    setTwoFaToken(data.token);
                    setTwoFaCode('');
                    return;
                }
                messages = [data.message];
            }

            messages.forEach(message => snackbar(message, error ? "error" : "success"));
            console.log(error || data);
        } catch (error) {
            snackbar("Сталася неочікувана помилка", "error");
            console.log(error)
        }
    };

    const handleVerify2fa = async () => {
        try {
            const { error, data } = await verify2fa({ token: twoFaToken, code: twoFaCode });
            if (error) {
                snackbar(error.data?.message || "Невірний код 2FA", "error");
                return;
            }
            localStorage.setItem('token', data.token);
            snackbar(data.message, "success");
            setTwoFaRequired(false);
            setLoginModalOpen(false);
        } catch (error) {
            snackbar("Сталася неочікувана помилка", "error");
        }
    };

    const handleOpenLoginModal = () => setLoginModalOpen(true);
    const handleCloseLoginModal = () => {
        setLoginModalOpen(false);
        setTwoFaRequired(false);
        setEmail('');
        setPassword('');
        setTwoFaCode('');
        setTwoFaToken('');
    };

    return (
        <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Відкрити форму входу">
                <SecondaryButton onClick={handleOpenLoginModal}>Увійти</SecondaryButton>
            </Tooltip>
            <Modal open={loginModalOpen} onClose={handleCloseLoginModal}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 350,
                    bgcolor: 'background.paper',
                    borderRadius: 4,
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" fontWeight={700}>Вхід до системи</Typography>
                        <IconButton onClick={handleCloseLoginModal}><CloseIcon /></IconButton>
                    </Box>
                    <Stack spacing={2}>
                        {!twoFaRequired ? <>
                            <TextField variant={"standard"} onChange={e => setEmail(e.target.value)} label="Email"
                                sx={{ color: 'gold.main' }} value={email || ''} />
                            <TextField variant={"standard"} onChange={e => setPassword(e.target.value)} label="Пароль"
                                type="password" value={password || ''} />
                            <PrimaryButton onClick={handleLogin}>
                                Увійти
                            </PrimaryButton>
                        </> : <>
                            <TextField variant={"standard"} onChange={e => setTwoFaCode(e.target.value)} label="Код 2FA"
                                type="text" autoFocus autoComplete="one-time-code" value={twoFaCode || ''} placeholder="Введіть код з застосунку" />
                            <PrimaryButton onClick={handleVerify2fa}>
                                Підтвердити 2FA
                            </PrimaryButton>
                        </>}
                    </Stack>
                </Box>
            </Modal>
        </Box>
    )
}
