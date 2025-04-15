import { Button, Card, CardMedia, Typography, Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Chip } from "@mui/material";
import logo from "@images/logo.png"
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { styled } from '@mui/material/styles';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import useBottomSnackbar from "@components/ui/snackbars/BottomSnackbar.jsx";
import { useSelector } from "react-redux";
import { selectUser } from "src/services/store/slices/userSlice.jsx";
import { useState } from "react";
import { useDeleteSurveyMutation, useUpdateSurveyMutation } from "src/services/store/api/surveyApi.jsx";

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: theme.shadows[8],
    }
}));

const AnimatedBox = styled(Box)(({ delay }) => ({
    position: 'absolute',
    transform: 'translateX(-20px)',
    opacity: 0,
    transition: 'all 0.3s ease',
    transitionDelay: `${delay}ms`,
    '.MuiCard-root:hover &': {
        transform: 'translateX(0)',
        opacity: 1
    }
}));

const ContentBox = styled(Box)({
    position: 'relative',
    height: '160px'
});

export const SurveyCard = ({ survey, onMouseEnter, onMouseLeave, onSurveyDeleted }) => {
    const { title, subtitle, id, createdAt, open, user } = survey;
    const snackbar = useBottomSnackbar();
    const currentUser = useSelector(selectUser);
    const isCreator = currentUser?.id === user.id;
    const [deleteSurvey] = useDeleteSurveyMutation();
    const [updateSurvey] = useUpdateSurveyMutation();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleShare = () => {
        const surveyUrl = `${window.location.origin}/surveys/${id}`;
        navigator.clipboard.writeText(surveyUrl).then(() => {
            snackbar("Survey link copied to clipboard!", "success");
        });
    };

    const handleDelete = async () => {
        try {
            const { error } = await deleteSurvey(id);
            if (error) {
                snackbar(error.data.message || "Failed to delete survey", "error");
            } else {
                snackbar("Survey deleted successfully!", "success");
                setDeleteDialogOpen(false);
                if (onSurveyDeleted) {
                    onSurveyDeleted();
                }
            }
        } catch (error) {
            snackbar("An unexpected error occurred", "error");
            console.error(error);
        }
    };

    const handleToggleStatus = async () => {
        try {
            const { error } = await updateSurvey({
                id: survey.id,
                data: {
                    ...survey,
                    open: !survey.open
                }
            });
            if (error) {
                snackbar(error.data.message || "Failed to update survey status", "error");
            } else {
                snackbar(`Survey ${!survey.open ? 'opened' : 'closed'} successfully!`, "success");
            }
        } catch (error) {
            snackbar("An unexpected error occurred", "error");
            console.error(error);
        }
    };

    return (
        <>
            <StyledCard
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                }}>
                    <CardMedia
                        sx={{
                            height: 140,
                            width: '100%',
                            objectFit: 'cover',
                        }}
                        image={logo}
                    />
                    {isCreator && (
                        <Chip
                            label="My"
                            size="small"
                            color="primary"
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                zIndex: 1
                            }}
                        />
                    )}
                    <ContentBox sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex' }}>
                            <Box sx={{ width: '40%' }}>
                                <Typography variant="h5" gutterBottom>
                                    {title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {subtitle}
                                </Typography>
                                <Chip
                                    icon={open ? <LockOpenIcon /> : <LockIcon />}
                                    label={open ? "Open" : "Closed"}
                                    color={open ? "success" : "error"}
                                    size="small"
                                    sx={{ mt: 1 }}
                                />
                            </Box>

                            <Box sx={{ width: '60%', position: 'relative', pl: 2 }}>
                                <AnimatedBox delay={0} sx={{ top: 0 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Created by
                                    </Typography>
                                    <Typography variant="body2">
                                        {user.username}
                                    </Typography>
                                </AnimatedBox>

                                <AnimatedBox delay={100} sx={{ top: 45 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Created on
                                    </Typography>
                                    <Typography variant="body2">
                                        {new Date(createdAt).toLocaleDateString()}
                                    </Typography>
                                </AnimatedBox>
                            </Box>
                        </Box>

                        <Box sx={{
                            position: 'absolute',
                            bottom: 10,
                            right: 16,
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <IconButton
                                onClick={handleShare}
                                size="small"
                                sx={{
                                    color: 'primary.main',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 123, 255, 0.1)'
                                    }
                                }}
                            >
                                <ShareIcon />
                            </IconButton>
                            {isCreator && (
                                <>
                                    <IconButton
                                        onClick={handleToggleStatus}
                                        size="small"
                                        sx={{
                                            color: open ? 'success.main' : 'error.main',
                                            '&:hover': {
                                                backgroundColor: open ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)'
                                            }
                                        }}
                                    >
                                        {open ? <LockOpenIcon /> : <LockIcon />}
                                    </IconButton>
                                    <IconButton
                                        onClick={() => setDeleteDialogOpen(true)}
                                        size="small"
                                        sx={{
                                            color: 'error.main',
                                            '&:hover': {
                                                backgroundColor: 'rgba(220, 53, 69, 0.1)'
                                            }
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton
                                        component={Link}
                                        to={`/edit-survey/${id}`}
                                        size="small"
                                        sx={{
                                            color: 'primary.main',
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 123, 255, 0.1)'
                                            }
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </>
                            )}
                            <Button
                                variant="contained"
                                size="small"
                                component={Link}
                                to={`/surveys/${id}`}
                            >
                                Learn More
                            </Button>
                        </Box>
                    </ContentBox>
                </Box>
            </StyledCard>

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Delete Survey</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this survey? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        color="error"
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

SurveyCard.propTypes = {
    survey: PropTypes.object.isRequired,
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired,
    onSurveyDeleted: PropTypes.func
};