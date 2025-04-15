import { Box, Button, Container, Paper, TextField, Typography, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCreateSurveyMutation } from "src/services/store/api/surveyApi.jsx";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useBottomSnackbar from "@components/ui/snackbars/BottomSnackbar.jsx";
import { useState } from "react";
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    marginTop: theme.spacing(4),
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.02) 0%, rgba(255,255,255,1) 100px)',
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[3],
    '&:hover': {
        boxShadow: theme.shadows[6],
    },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
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
}));

export default function CreateSurvey() {
    const navigate = useNavigate();
    const [createSurvey, { isLoading }] = useCreateSurveyMutation();
    const snackbar = useBottomSnackbar();
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
    });

    const handleBack = () => {
        navigate('/');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { error, data } = await createSurvey(formData);
            if (error) {
                snackbar(error.data.message || "Failed to create survey", "error");
            } else {
                snackbar("Survey created successfully!", "success");
                navigate('/my-surveys');
            }
        } catch (error) {
            snackbar("An unexpected error occurred", "error");
            console.error(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
                <IconButton onClick={handleBack} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    Create New Survey
                </Typography>
            </Box>

            <StyledPaper>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, color: 'text.secondary' }}>
                            Survey Title
                        </Typography>
                        <StyledTextField
                            fullWidth
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter a descriptive title for your survey"
                            variant="outlined"
                            required
                            inputProps={{ maxLength: 100 }}
                            helperText={`${formData.title.length}/100 characters`}
                        />
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, color: 'text.secondary' }}>
                            Survey Description
                        </Typography>
                        <StyledTextField
                            fullWidth
                            name="subtitle"
                            value={formData.subtitle}
                            onChange={handleChange}
                            placeholder="Provide more details about your survey"
                            variant="outlined"
                            multiline
                            rows={4}
                            required
                            inputProps={{ maxLength: 500 }}
                            helperText={`${formData.subtitle.length}/500 characters`}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={handleBack}
                            sx={{ minWidth: 120 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isLoading}
                            sx={{ minWidth: 120 }}
                        >
                            {isLoading ? 'Creating...' : 'Create Survey'}
                        </Button>
                    </Box>
                </form>
            </StyledPaper>
        </Container>
    );
} 