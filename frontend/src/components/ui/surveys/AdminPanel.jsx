import { SurveyFilterSearch } from "@components/ui/surveys/SurveyFilterSearch.jsx";
import AddIcon from '@mui/icons-material/Add';
import BarChartIcon from '@mui/icons-material/BarChart';
import HomeIcon from '@mui/icons-material/Home';
import { Box, Button, Container, Typography } from "@mui/material";
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useGetAllUserSurveysQuery, useGetUserSurveysQuery } from "src/services/store/api/surveyApi.jsx";
import { useGrantAdminMutation } from 'src/services/store/api/userApi.jsx';
import { selectIsAdmin, selectUser } from "src/services/store/slices/userSlice.jsx";
import { theme } from "src/theme.jsx";
import SurveyStatisticsModal from "./SurveyStatisticsModal.jsx";

export default function AdminPanel() {
    const user = useSelector(selectUser);
    const isAdmin = useSelector(selectIsAdmin);
    const [grantAdmin, { isLoading: isGranting }] = useGrantAdminMutation();
    const [grantEmail, setGrantEmail] = useState('');
    const [grantError, setGrantError] = useState('');
    const [grantSuccess, setGrantSuccess] = useState('');

    const [anchorEl, setAnchorEl] = useState(null);
    const [statsOpen, setStatsOpen] = useState(false);
    const { data: allSurveys, isLoading: isLoadingAll, refetch: refetchAllSurveys } = useGetAllUserSurveysQuery(undefined, { skip: !statsOpen });
    const { refetch } = useGetUserSurveysQuery({ page: 0 }, { skip: true }); // For getting the refetch function

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setGrantError('');
        setGrantSuccess('');
    };

    const handleStatsOpen = () => {
        setStatsOpen(true);
        setTimeout(() => refetchAllSurveys(), 0);
    };

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: { xs: 2, sm: 0 },
                mb: { xs: 3, md: 4 },
                position: 'relative'
            }}>
                <Typography
                    variant="h3"
                    sx={{
                        textAlign: { xs: 'center', sm: 'left' },
                        width: { xs: '100%', sm: 'auto' },
                        fontWeight: 600,
                        color: "primary.main",
                        fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                    }}
                >
                    Панель адміністратора
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                        component={Link}
                        to="/"
                        variant="outlined"
                        startIcon={<HomeIcon />}
                        sx={{
                            minWidth: { xs: '40%', sm: 120 },
                            height: { xs: 42, md: 48 },
                            borderRadius: 2,
                            boxShadow: theme.shadows[1],
                            '&:hover': {
                                boxShadow: theme.shadows[3],
                            }
                        }}
                    >
                        Головна
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<BarChartIcon />}
                        onClick={handleStatsOpen}
                        sx={{
                            minWidth: { xs: '40%', sm: 120 },
                            height: { xs: 42, md: 48 },
                            borderRadius: 2,
                            fontWeight: 600,
                            boxShadow: theme.shadows[1],
                            '&:hover': {
                                boxShadow: theme.shadows[3],
                            }
                        }}
                    >
                        Статистика по опитуваннях
                    </Button>
                    {isAdmin && (
                        <Button
                            component={Link}
                            to="/create-survey"
                            variant="contained"
                            startIcon={<AddIcon />}
                            sx={{
                                minWidth: { xs: '60%', sm: 200 },
                                height: { xs: 42, md: 48 },
                                borderRadius: 2,
                                boxShadow: theme.shadows[3],
                                '&:hover': {
                                    boxShadow: theme.shadows[6],
                                }
                            }}
                        >
                            Створити нове опитування
                        </Button>
                    )}
                    {isAdmin && (
                        <Button
                            color="secondary"
                            variant="outlined"
                            onClick={handleMenuOpen}
                            sx={{ ml: 1, fontWeight: 600, borderRadius: 2, height: { xs: 42, md: 48 } }}
                        >
                            Передати роль адміністратора
                        </Button>
                    )}
                </Box>
                <Popover
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    PaperProps={{ sx: { p: 3, minWidth: 320, borderRadius: 3 } }}
                >
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>Передати роль адміністратора</Typography>
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        setGrantError('');
                        setGrantSuccess('');
                        if (!grantEmail.trim()) {
                            setGrantError('Введіть email користувача');
                            return;
                        }
                        try {
                            await grantAdmin(grantEmail).unwrap();
                            setGrantSuccess('Роль адміністратора успішно передано!');
                            setGrantEmail('');
                        } catch (err) {
                            setGrantError(err?.data?.message || err?.data?.error || err?.message || 'Не вдалося передати роль адміністратора');
                        }
                    }}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                            <TextField
                                type="email"
                                value={grantEmail}
                                onChange={e => setGrantEmail(e.target.value)}
                                placeholder="Email користувача"
                                size="small"
                                fullWidth
                                disabled={isGranting}
                                required
                            />
                            <Button type="submit" variant="contained" color="primary" disabled={isGranting || !grantEmail.trim()}>
                                Передати
                            </Button>
                        </Box>
                        {grantError && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{grantError}</Typography>}
                        {grantSuccess && <Typography color="success.main" variant="body2" sx={{ mt: 1 }}>{grantSuccess}</Typography>}
                    </form>
                </Popover>
            </Box>

            <SurveyStatisticsModal
                open={statsOpen}
                onClose={() => setStatsOpen(false)}
                surveys={allSurveys || []}
                loading={isLoadingAll}
            />

            <SurveyFilterSearch
                useQueryHook={useGetUserSurveysQuery}
                emptyStateMessage="У вас ще немає опитувань. Створіть нове опитування, щоб почати!"
                refetch={refetch}
            />
        </Container>
    );
} 