import { Box, Typography, Paper, Container, Chip, Button, CircularProgress, IconButton, Card, CardMedia, Divider, Avatar } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useGetSurveyQuery } from "src/services/store/api/surveyApi.jsx";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import useBottomSnackbar from "@components/ui/snackbars/BottomSnackbar.jsx";

export default function SurveyDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: surveyData, isLoading } = useGetSurveyQuery(id);
    const snackbar = useBottomSnackbar();

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleBack = () => {
        navigate('/');
    };

    const handleShare = () => {
        const surveyUrl = `${window.location.origin}/survey/${id}`;
        navigator.clipboard.writeText(surveyUrl).then(() => {
            snackbar("Survey link copied to clipboard!", "success");
        });
    };

    if (isLoading) {
        return (
            <Container maxWidth="md">
                <IconButton
                    onClick={handleBack}
                    sx={{ mt: 2, mb: 2 }}
                >
                    <ArrowBackIcon />
                </IconButton>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (!surveyData) {
        return (
            <Container maxWidth="md">
                <IconButton
                    onClick={handleBack}
                    sx={{ mt: 2, mb: 2 }}
                >
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h5" color="error" align="center" sx={{ mt: 4 }}>
                    Survey not found
                </Typography>
            </Container>
        );
    }

    const { survey } = surveyData;

    return (
        <Container maxWidth="md" sx={{ pb: 4 }}>
            <IconButton
                onClick={handleBack}
                sx={{ mt: 2, mb: 2 }}
            >
                <ArrowBackIcon />
            </IconButton>

            <Paper
                elevation={3}
                sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.02) 0%, rgba(255,255,255,1) 100px)'
                }}
            >
                {survey.imageUrl && (
                    <Box sx={{ position: 'relative', width: '100%', height: 300 }}>
                        <CardMedia
                            component="img"
                            image={survey.imageUrl}
                            alt={survey.title}
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                                p: 3,
                                color: 'white'
                            }}
                        >
                            <Typography variant="h3" sx={{
                                fontWeight: 'bold',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                            }}>
                                {survey.title}
                            </Typography>
                        </Box>
                    </Box>
                )}

                <Box sx={{ p: 4 }}>
                    {!survey.imageUrl && (
                        <Typography variant="h3" gutterBottom sx={{
                            color: 'primary.main',
                            fontWeight: 'bold',
                            mb: 3
                        }}>
                            {survey.title}
                        </Typography>
                    )}

                    <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
                        {survey.subtitle}
                    </Typography>

                    <Box sx={{
                        display: 'flex',
                        gap: 3,
                        mb: 4,
                        flexWrap: 'wrap',
                        p: 2,
                        bgcolor: 'background.paper',
                        borderRadius: 1,
                        boxShadow: '0 0 10px rgba(0,0,0,0.05)'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            flex: '1 1 auto',
                            minWidth: '200px'
                        }}>
                            <Avatar
                                src={survey.user.avatarUrl}
                                sx={{
                                    width: 48,
                                    height: 48,
                                    bgcolor: 'primary.main'
                                }}
                            >
                                {survey.user.username.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Created by
                                </Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                    {survey.user.username}
                                </Typography>
                            </Box>
                        </Box>

                        <Divider orientation="vertical" flexItem />

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarTodayIcon color="primary" />
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Created on
                                </Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                    {formatDate(survey.createdAt)}
                                </Typography>
                            </Box>
                        </Box>

                        <Divider orientation="vertical" flexItem />

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <HowToVoteIcon color="primary" />
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Status
                                </Typography>
                                <Chip
                                    label={survey.open ? "Open" : "Closed"}
                                    color={survey.open ? "success" : "error"}
                                    size="small"
                                    sx={{
                                        fontWeight: 'bold',
                                        '& .MuiChip-label': {
                                            px: 1
                                        }
                                    }}
                                />
                            </Box>
                        </Box>

                        {survey.totalVotes !== undefined && (
                            <>
                                <Divider orientation="vertical" flexItem />
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <VisibilityIcon color="primary" />
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Total votes
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                            {survey.totalVotes}
                                        </Typography>
                                    </Box>
                                </Box>
                            </>
                        )}
                    </Box>

                    {survey.open && (
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
                                Vote Options
                            </Typography>
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                gap: 2
                            }}>
                                {surveyData.options?.map((option) => (
                                    <Button
                                        key={option.id}
                                        variant="outlined"
                                        size="large"
                                        sx={{
                                            p: 2,
                                            height: '100%',
                                            textTransform: 'none',
                                            borderWidth: 2,
                                            '&:hover': {
                                                borderWidth: 2,
                                                bgcolor: 'primary.main',
                                                color: 'white'
                                            }
                                        }}
                                    >
                                        {option.name}
                                    </Button>
                                ))}
                            </Box>
                        </Box>
                    )}

                    {!survey.open && (
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
                                Results
                            </Typography>
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                                gap: 3
                            }}>
                                {surveyData.options?.map((option) => (
                                    <Card key={option.id} sx={{
                                        p: 2,
                                        position: 'relative',
                                        overflow: 'visible'
                                    }}>
                                        <Box sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '4px',
                                            bgcolor: 'primary.main',
                                            borderTopLeftRadius: 'inherit',
                                            borderTopRightRadius: 'inherit'
                                        }} />
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
                                            {option.name}
                                        </Typography>
                                        <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                                            {option.votes}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            votes
                                        </Typography>
                                    </Card>
                                ))}
                            </Box>
                        </Box>
                    )}
                </Box>
            </Paper>
        </Container>
    );
} 