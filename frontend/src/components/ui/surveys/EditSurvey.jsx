import { Box, Button, Container, Paper, TextField, Typography, IconButton, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useGetSurveyQuery, useUpdateSurveyMutation } from "src/services/store/api/surveyApi.jsx";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useBottomSnackbar from "@components/ui/snackbars/BottomSnackbar.jsx";
import { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import { useSelector } from "react-redux";
import { selectUser } from "src/services/store/slices/userSlice.jsx";

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

export default function EditSurvey() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: surveyData, isLoading: isSurveyLoading } = useGetSurveyQuery(id);
    const [updateSurvey, { isLoading: isUpdating }] = useUpdateSurveyMutation();
    const snackbar = useBottomSnackbar();
    const currentUser = useSelector(selectUser);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
    });

    useEffect(() => {
        if (surveyData?.survey) {
            setFormData({
                title: surveyData.survey.title,
                subtitle: surveyData.survey.subtitle,
            });
        }
    }, [surveyData]);

    const handleBack = () => {
        navigate('/my-surveys');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { error, data } = await updateSurvey({
                id,
                data: {
                    id,
                    title: formData.title,
                    subtitle: formData.subtitle,
                    open: surveyData.survey.open
                }
            });
            if (error) {
                snackbar(error.data.message || "Failed to update survey", "error");
            } else {
                snackbar("Survey updated successfully!", "success");
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

    if (isSurveyLoading) {
        return (
            <Container maxWidth="md">
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (!surveyData?.survey) {
        return (
            <Container maxWidth="md">
                <Typography variant="h5" color="error" align="center" sx={{ mt: 4 }}>
                    Survey not found
                </Typography>
            </Container>
        );
    }

    if (currentUser?.id !== surveyData.survey.user.id) {
        return (
            <Container maxWidth="md">
                <Typography variant="h5" color="error" align="center" sx={{ mt: 4 }}>
                    You don't have permission to edit this survey
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
                <IconButton onClick={handleBack} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    Edit Survey
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
                            disabled={isUpdating}
                            sx={{ minWidth: 120 }}
                        >
                            {isUpdating ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </Box>
                </form>
            </StyledPaper>
        </Container>
    );
} 