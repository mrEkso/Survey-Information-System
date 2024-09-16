import {useSnackbar} from 'notistack';

const useTopSnackbar = () => {
    const {enqueueSnackbar} = useSnackbar();

    return (message, variant = 'info') => {
        enqueueSnackbar(message, {
            variant, // 'success', 'error', 'warning', 'info'
            autoHideDuration: 5000,
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
            },
        });
    };
};

export default useTopSnackbar;
