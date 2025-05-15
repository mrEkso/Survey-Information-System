import useBottomSnackbar from '@components/ui/snackbars/BottomSnackbar.jsx';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, IconButton, Modal, Typography } from '@mui/material';
import QRCode from 'react-qr-code';

export default function SurveyQrModal({ open, onClose, voteUrl }) {
    const snackbar = useBottomSnackbar();
    const handleCopy = () => {
        navigator.clipboard.writeText(voteUrl);
        snackbar('Посилання на опитування скопійовано в буфер обміну!', 'success');
    };
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                borderRadius: 3,
                boxShadow: 24,
                p: 4,
                minWidth: 320,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2
            }}>
                <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" fontWeight={700} mb={1}>
                    QR-код для голосування
                </Typography>
                <QRCode value={voteUrl} size={180} />
                <Typography variant="body2" color="textSecondary" mt={1} sx={{ wordBreak: 'break-all', textAlign: 'center' }}>{voteUrl}</Typography>
                <Button variant="outlined" size="small" onClick={handleCopy}>
                    Скопіювати посилання
                </Button>
            </Box>
        </Modal>
    );
} 