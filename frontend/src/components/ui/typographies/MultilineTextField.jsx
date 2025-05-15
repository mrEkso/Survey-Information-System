import { TextField } from "@mui/material";
import { styled } from '@mui/material/styles';

const StyledMultilineTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: theme.palette.primary.main,
        },
        '&:hover fieldset': {
            borderColor: theme.palette.primary.dark,
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
        },
    },
    '& .MuiInputBase-multiline': {
        height: 'auto !important',
    }
}));

export default function MultilineTextField({ minRows = 1, maxRows = 7, ...props }) {
    return (
        <StyledMultilineTextField
            fullWidth
            multiline
            minRows={minRows}
            maxRows={maxRows}
            variant="outlined"
            sx={{
                width: '100%',
                '& .MuiOutlinedInput-root': {
                    height: 'auto',
                    display: 'flex',
                    alignItems: 'flex-start'
                },
                ...props.sx
            }}
            {...props}
        />
    );
} 