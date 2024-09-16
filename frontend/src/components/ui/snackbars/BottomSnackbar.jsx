import {useSnackbar} from 'notistack';

const useBottomSnackbar = () => {
    const {enqueueSnackbar} = useSnackbar();

    return (message, variant = 'info') => {
        enqueueSnackbar(message, {
            variant, // 'success', 'error', 'warning', 'info'
            autoHideDuration: 5000,
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center',
            },
        });
    };
};

export default useBottomSnackbar;
