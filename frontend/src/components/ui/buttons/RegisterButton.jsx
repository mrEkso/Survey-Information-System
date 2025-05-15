import { PrimaryButton } from "@components/ui/buttons/PrimaryButton.jsx";
import { SecondaryButton } from "@components/ui/buttons/SecondaryButton";
import useBottomSnackbar from "@components/ui/snackbars/BottomSnackbar.jsx";
import useTopSnackbar from "@components/ui/snackbars/TopSnackbar.jsx";
import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Modal, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { useRegisterMutation, useVerify2faMutation } from "src/services/store/api/authApi.jsx";

export const RegisterButton = () => {
    const [nickname, setNickname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [registerModalOpen, setRegisterModalOpen] = useState(false);
    const [register, { data: registerData, isLoading: isRegistering }] = useRegisterMutation();
    const [verify2fa] = useVerify2faMutation();
    const [code, setCode] = useState("");
    const [show2fa, setShow2fa] = useState(false);
    const [status, setStatus] = useState("");
    const snackbar = useTopSnackbar();
    const bottomSnackbar = useBottomSnackbar();

    const handleRegister = async () => {
        try {
            const result = await register({ nickname, email, password }).unwrap();
            setShow2fa(true);
            bottomSnackbar('Завершіть реєстрацію: підтвердіть 2FA-код із застосунку', "warning");
        } catch (error) {
            snackbar(error?.data?.message || "Помилка при реєстрації", "error");
        }
    };

    const handleVerify2fa = async () => {
        setStatus("");
        try {
            const res = await verify2fa({ token: registerData.token, code }).unwrap();
            snackbar(res.message, "success");
            setShow2fa(false);
            handleCloseRegisterModal();
        } catch (error) {
            snackbar(error?.data?.message || "Помилка при перевірці 2FA", "error");
        }
    };

    const handleOpenRegisterModal = () => setRegisterModalOpen(true);
    const handleCloseRegisterModal = () => {
        setRegisterModalOpen(false);
        setNickname('');
        setEmail('');
        setPassword('');
        setShow2fa(false);
        setStatus("");
        setCode("");
    };

    return (
        <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Відкрити форму реєстрації">
                <SecondaryButton onClick={handleOpenRegisterModal}>Реєстрація</SecondaryButton>
            </Tooltip>
            <Modal open={registerModalOpen} onClose={handleCloseRegisterModal}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: 320, sm: 350 },
                    maxWidth: '95vw',
                    maxHeight: '90vh',
                    bgcolor: 'background.paper',
                    borderRadius: 4,
                    boxShadow: 24,
                    p: 3,
                    overflowY: 'auto',
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" fontWeight={700}>Реєстрація</Typography>
                        <IconButton onClick={handleCloseRegisterModal}><CloseIcon /></IconButton>
                    </Box>
                    <Stack spacing={2} sx={{ width: '100%' }}>
                        {!show2fa && <>
                            <TextField variant={"standard"} onChange={e => setNickname(e.target.value)} label="Нікнейм"
                                sx={{ color: 'gold.main' }} />
                            <TextField variant={"standard"} onChange={e => setEmail(e.target.value)} label="Email"
                                sx={{ color: 'gold.main' }} />
                            <TextField variant={"standard"} onChange={e => setPassword(e.target.value)} label="Пароль"
                                type="password" />
                            <PrimaryButton onClick={handleRegister} disabled={isRegistering}>
                                Реєстрація
                            </PrimaryButton>
                        </>}
                        {show2fa && registerData && registerData.qrUrl && (
                            <>
                                <Typography>Скануйте цей QR-код в Google Authenticator:</Typography>
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(registerData.qrUrl)}&size=200x200`} alt="QR Code" style={{ maxWidth: '100%', height: 'auto', margin: '0 auto', display: 'block' }} />
                                <Typography>Або використовуйте секрет: <b>{registerData.secret}</b></Typography>
                                <TextField
                                    variant="standard"
                                    label="Код з застосунку"
                                    value={code}
                                    onChange={e => setCode(e.target.value)}
                                />
                                <PrimaryButton onClick={handleVerify2fa} disabled={!code}>
                                    Підтвердити 2FA
                                </PrimaryButton>
                            </>
                        )}
                    </Stack>
                </Box>
            </Modal>
        </Box>
    )
}
