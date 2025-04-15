import { Box, Typography, Container, CircularProgress, Button } from "@mui/material";
import { SurveysGrid } from "@components/ui/grids/SurveysGrid.jsx";
import { useGetUserSurveysQuery } from "src/services/store/api/surveyApi.jsx";
import { useSelector } from "react-redux";
import { selectUser } from "src/services/store/slices/userSlice.jsx";
import { CenteredContainer } from "@components/ui/containers/CenteredContainer.jsx";
import { SecondaryTypography } from "@components/ui/typographies/SecondaryTypography.jsx";
import { GoldPagination } from "@components/ui/paginations/GoldPagination.jsx";
import { useState } from "react";
import { theme } from "src/theme.jsx";
import { Link } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';

export default function UserSurveys() {
    const [page, setPage] = useState(0);
    const user = useSelector(selectUser);
    const { data: surveys, isLoading, refetch } = useGetUserSurveysQuery(page);

    const handlePaginationChange = (event, value) => {
        setPage(value - 1);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography
                    variant="h3"
                    sx={{
                        textAlign: "center",
                        fontWeight: 600,
                        color: "primary.main",
                    }}
                >
                    My Surveys
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        component={Link}
                        to="/"
                        variant="outlined"
                        startIcon={<HomeIcon />}
                        sx={{
                            minWidth: 120,
                            height: 48,
                            borderRadius: 2,
                            boxShadow: theme.shadows[1],
                            '&:hover': {
                                boxShadow: theme.shadows[3],
                            }
                        }}
                    >
                        Home
                    </Button>
                    <Button
                        component={Link}
                        to="/create-survey"
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{
                            minWidth: 200,
                            height: 48,
                            borderRadius: 2,
                            boxShadow: theme.shadows[3],
                            '&:hover': {
                                boxShadow: theme.shadows[6],
                            }
                        }}
                    >
                        Create Survey
                    </Button>
                </Box>
            </Box>

            <CenteredContainer>
                {isLoading ? (
                    <CircularProgress />
                ) : surveys ? (
                    <>
                        {surveys.content.length > 0 ? (
                            <>
                                <SurveysGrid surveys={surveys} marginBottom={3} onSurveyDeleted={refetch} />
                                <GoldPagination
                                    sx={{ marginBottom: theme.spacing(2) }}
                                    page={page + 1}
                                    count={surveys.totalPages}
                                    onChange={handlePaginationChange}
                                />
                            </>
                        ) : (
                            <SecondaryTypography>
                                You haven't created any surveys yet.
                            </SecondaryTypography>
                        )}
                    </>
                ) : (
                    <SecondaryTypography>
                        Failed to load your surveys. Please try again later.
                    </SecondaryTypography>
                )}
            </CenteredContainer>
        </Container>
    );
} 