import { LogoAvatar } from '@components/ui/LogoAvatar.jsx';
import useBottomSnackbar from "@components/ui/snackbars/BottomSnackbar.jsx";
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import useResponsive from "@hooks/useResponsive";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Avatar, Box, Button, CardMedia, Checkbox, Chip, CircularProgress, Container, Divider, FormControlLabel, FormGroup, IconButton, Paper, Radio, Rating, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAddMessageMutation } from 'src/services/store/api/messageApi';
import { useGetSurveyImageQuery, useGetSurveyQuery, useUpdateSurveyMutation } from "src/services/store/api/surveyApi.jsx";
import { useUnvoteMutation, useVoteMutation } from "src/services/store/api/voteApi.jsx";
import { selectIsAdmin, selectIsOwner, selectUser } from "src/services/store/slices/userSlice.jsx";
import SurveyQrModal from './SurveyQrModal';
import ChartContainer from './charts/ChartContainer';
import RankingPositionTable from './charts/RankingPositionTable';

// Function to format date as DD-MM-YYYY
function formatDateTick(dateStr) {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
}

function formatExpirationDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year}, ${hours}:${minutes}`;
}

export default function SurveyDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: surveyData, isLoading, refetch } = useGetSurveyQuery(id);
    const snackbar = useBottomSnackbar();
    const currentUser = useSelector(selectUser);
    const [vote, { isLoading: isVoting }] = useVoteMutation();
    const [unvote, { isLoading: isUnvoting }] = useUnvoteMutation();
    const [selectedOption, setSelectedOption] = useState(null);
    const [updateSurvey, { isLoading: isUpdating }] = useUpdateSurveyMutation();
    const { isMobile, isSmallMobile } = useResponsive();
    const survey = surveyData?.survey;
    const isOwner = useSelector(state => selectIsOwner(state, survey?.user?.id));
    const isAdmin = useSelector(selectIsAdmin);
    const [showQrModal, setShowQrModal] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [toggleDialogOpen, setToggleDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [showExpirationDialog, setShowExpirationDialog] = useState(false);
    const [newExpirationDate, setNewExpirationDate] = useState(null);

    // State for advanced survey types
    const [ratingValues, setRatingValues] = useState({});
    const [matrixValues, setMatrixValues] = useState({});
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [rankingOrder, setRankingOrder] = useState([]);

    // Получаем fileName из imageUrl
    let fileName = null;
    if (survey && survey.imageUrl) {
        const parts = survey.imageUrl.split('/');
        fileName = parts[parts.length - 1];
    }
    const { data: fileData, isSuccess } = useGetSurveyImageQuery(fileName, { skip: !fileName });
    const [imageSrc, setImageSrc] = useState(null);
    useEffect(() => {
        if (isSuccess && fileData) {
            setImageSrc(fileData);
        } else {
            setImageSrc(null);
        }
    }, [isSuccess, fileData, fileName]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleShare = () => {
        const surveyUrl = `${window.location.origin}/survey/${id}`;
        navigator.clipboard.writeText(surveyUrl).then(() => {
            snackbar("Посилання скопійовано", "success");
        });
    };

    // Initialize ranking order when survey loads
    useEffect(() => {
        if (survey && survey.surveyType === 'RANKING' && survey.options && survey.options.length > 0) {
            setRankingOrder(survey.options.map(option => option.id));
        }
    }, [survey]);

    // Initialize existing vote data for advanced survey types
    useEffect(() => {
        if (survey && surveyData?.vote) {
            const voteValues = surveyData.vote.voteValues || [];

            if (survey.surveyType === 'RATING_SCALE') {
                const ratings = {};
                voteValues.forEach(value => {
                    ratings[value.surveyOptionId] = value.numericValue;
                });
                setRatingValues(ratings);
            }
            else if (survey.surveyType === 'MATRIX') {
                const matrix = {};
                voteValues.forEach(value => {
                    matrix[`${value.surveyOptionId}_${value.numericValue}`] = true;
                });
                setMatrixValues(matrix);
            }
            else if (survey.surveyType === 'MULTIPLE_CHOICE') {
                setSelectedOptions(voteValues.map(value => value.surveyOptionId));
            }
            else if (survey.surveyType === 'RANKING') {
                const sortedOptions = [];
                voteValues.forEach(value => {
                    sortedOptions[value.rankPosition] = value.surveyOptionId;
                });

                if (sortedOptions.filter(Boolean).length > 0) {
                    setRankingOrder(sortedOptions.filter(Boolean));
                }
            }
        } else {
            // Reset vote state when no vote exists
            setRatingValues({});
            setMatrixValues({});
            setSelectedOptions([]);
            if (survey && survey.surveyType === 'RANKING' && survey.options) {
                setRankingOrder(survey.options.map(option => option.id));
            }
        }
    }, [surveyData?.vote, survey]);

    const handleVote = async (option) => {
        if (!currentUser) {
            snackbar("Будь ласка, авторизуйтесь для голосування", "error");
            return;
        }

        try {
            setSelectedOption(option.id);

            // If user already voted, unvote first
            if (surveyData?.vote) {
                await unvote(id);
            }

            // Используем универсальный формат запроса
            const response = await vote({
                surveyId: id,
                surveyOptionId: option.id
            });

            if (response.error) {
                snackbar(response.error.data?.message || "Не вдалося зберегти вашу відповідь", "error");
                setSelectedOption(null);
            } else {
                snackbar("Ваша відповідь врахована!", "success");
                await refetch();
            }
        } catch (error) {
            console.error("Voting error:", error);
            snackbar("Сталася непередбачена помилка", "error");
            setSelectedOption(null);
        }
    };

    const handleUnvote = async () => {
        if (!currentUser) {
            snackbar("Будь ласка, авторизуйтесь", "error");
            return;
        }

        try {
            const response = await unvote(id);
            if (response.error) {
                snackbar(response.error.data?.message || "Не вдалося видалити вашу відповідь", "error");
            } else {
                snackbar(response.data?.message || "Ваша відповідь успішно видалена!", "success");
                setSelectedOption(null);
                await refetch();
            }
        } catch (error) {
            console.error("Unvoting error:", error);
            snackbar("Сталася непередбачена помилка", "error");
        }
    };

    const handleToggleStatus = async () => {
        // Если пытаемся открыть опрос, и дата закрытия в прошлом — предлагаем новую дату
        if (!survey.open && survey.expirationDate && new Date(survey.expirationDate) < new Date()) {
            const nextDay = new Date();
            nextDay.setDate(nextDay.getDate() + 1);
            setNewExpirationDate(nextDay.toISOString().slice(0, 16));
            setShowExpirationDialog(true);
            return;
        }
        try {
            const { error } = await updateSurvey({
                id: survey.id,
                data: {
                    ...survey,
                    open: !survey.open
                }
            });
            if (error) {
                snackbar(error.data.message || "Сталася помилка при оновленні опитування", "error");
            } else {
                snackbar(survey.open ? "Опитування закрито" : "Опитування відкрито", "success");
                setSelectedOption(null);
                await refetch();
            }
        } catch (error) {
            snackbar("Сталася непередбачена помилка", "error");
        }
    };

    // Reset selectedOption if user cancelled vote or survey data was updated
    useEffect(() => {
        if (!surveyData?.vote) {
            setSelectedOption(null);
        }
    }, [surveyData?.vote]);

    // --- Voting dynamics (cumulative, with zero point) ---
    const votesByDate = surveyData?.votes && !survey.open
        ? (() => {
            const options = survey.options;
            const optionNamesById = Object.fromEntries(options.map(o => [o.id, o.name]));
            const optionIds = options.map(o => o.id);
            const dateMap = {};
            surveyData.votes.forEach(vote => {
                const date = new Date(vote.createdAt).toISOString().split('T')[0];
                // Универсально: если есть voteValues, учитываем их, иначе берем верхнеуровневый surveyOptionId
                if (vote.voteValues && vote.voteValues.length > 0) {
                    vote.voteValues.forEach(vv => {
                        const optionId = vv.surveyOptionId;
                        const optionName = optionNamesById[optionId];
                        if (!dateMap[date]) {
                            dateMap[date] = {};
                            optionIds.forEach(id => dateMap[date][optionNamesById[id]] = 0);
                        }
                        dateMap[date][optionName]++;
                    });
                } else if (vote.surveyOptionId) {
                    const optionId = vote.surveyOptionId;
                    const optionName = optionNamesById[optionId];
                    if (!dateMap[date]) {
                        dateMap[date] = {};
                        optionIds.forEach(id => dateMap[date][optionNamesById[id]] = 0);
                    }
                    dateMap[date][optionName]++;
                }
            });
            // Найти минимальную дату
            const allDates = Object.keys(dateMap);
            if (allDates.length) {
                const minDate = allDates.sort()[0];
                const zeroDate = new Date(minDate);
                zeroDate.setDate(zeroDate.getDate() - 1);
                const zeroDateStr = zeroDate.toISOString().split('T')[0];
                dateMap[zeroDateStr] = {};
                optionIds.forEach(id => dateMap[zeroDateStr][optionNamesById[id]] = 0);
            }
            // Сортируем даты и считаем накопленные значения
            const sortedDates = Object.keys(dateMap).sort();
            const cumulative = {};
            optionIds.forEach(id => cumulative[optionNamesById[id]] = 0);
            return sortedDates.map(date => {
                const entry = { date };
                optionIds.forEach(id => {
                    const name = optionNamesById[id];
                    cumulative[name] += dateMap[date][name];
                    entry[name] = cumulative[name];
                });
                return entry;
            });
        })()
        : [];

    // --- Messages ---
    const messages = surveyData?.messages || [];
    const [addMessage, { isLoading: isAddingMessage }] = useAddMessageMutation();
    const [messageContent, setMessageContent] = useState('');
    const [messageError, setMessageError] = useState('');

    const MAX_MESSAGE_LENGTH = 500;

    const handleSendMessage = async (e) => {
        e.preventDefault();
        setMessageError('');
        if (!messageContent.trim()) {
            setMessageError('Введіть повідомлення');
            return;
        }
        if (messageContent.length > MAX_MESSAGE_LENGTH) {
            setMessageError(`Повідомлення не може бути довше ${MAX_MESSAGE_LENGTH} символів`);
            return;
        }
        try {
            await addMessage({ surveyId: id, content: messageContent }).unwrap();
            setMessageContent('');
            snackbar('Повідомлення надіслано', 'success');
        } catch (err) {
            console.error('Message send error:', err);
            const msg = err?.data?.message || err?.data?.error || err?.message || 'Не вдалося надіслати повідомлення';
            setMessageError(msg);
        }
    };

    const voteUrl = `${window.location.origin}/surveys/${id}`;

    // Експорт в Excel з даними
    const handleExportExcel = async () => {
        if (!survey || !survey.options) return;
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Результати');

        // Назва опитування і загальна інформація
        sheet.addRow([survey.title]);
        sheet.mergeCells('A1:D1');
        sheet.getCell('A1').font = { bold: true, size: 16 };
        sheet.addRow([]);

        // Загальна статистика
        sheet.addRow(['Загальна статистика']);
        sheet.mergeCells('A3:D3');
        sheet.getCell('A3').font = { bold: true, size: 14 };
        sheet.addRow(['Всього переглядів:', survey.views ?? 0]);
        sheet.addRow(['Всього голосів:', survey.votesCount ?? 0]);
        sheet.addRow(['Статус:', survey.open ? 'Відкрито' : 'Закрито']);
        sheet.addRow(['Дата створення:', new Date(survey.createdAt).toLocaleString()]);
        if (survey.expirationDate) {
            sheet.addRow(['Дата закриття:', new Date(survey.expirationDate).toLocaleString()]);
        }
        sheet.addRow([]);

        // Таблиця результатів
        sheet.addRow(['Детальна статистика по варіантах']);
        sheet.mergeCells('A9:D9');
        sheet.getCell('A9').font = { bold: true, size: 14 };
        sheet.addRow(['Варіант', 'Голосів', 'Відсоток', 'Переглядів', 'Відсоток від переглядів']);
        const totalVotes = survey.votesCount ?? 0;
        survey.options.forEach(option => {
            sheet.addRow([
                option.name,
                option.votes,
                totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(2) + '%' : '0%',
                survey.views ?? 0,
                (survey.views && survey.views > 0) ? ((option.votes / survey.views) * 100).toFixed(2) + '%' : '0%'
            ]);
        });

        // Форматування
        sheet.columns.forEach(col => col.width = 22);
        sheet.getRow(10).font = { bold: true };

        // Зберігаємо файл
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `survey_results_${survey.id}.xlsx`);
    };

    // Handle advanced voting
    const handleAdvancedVote = async () => {
        if (!currentUser) {
            snackbar("Будь ласка, авторизуйтесь для голосування", "error");
            return;
        }

        // Check for RATING_SCALE: all elements must be rated
        if (survey.surveyType === 'RATING_SCALE') {
            const filledCount = Object.keys(ratingValues).length;
            if (filledCount !== survey.options.length || Object.values(ratingValues).some(v => !v)) {
                snackbar("Потрібно оцінити кожен елемент!", "error");
                return;
            }
        }

        try {
            // Prepare vote values based on survey type
            let voteValues = [];

            if (survey.surveyType === 'RATING_SCALE') {
                voteValues = Object.entries(ratingValues).map(([optionId, rating]) => ({
                    surveyOptionId: optionId,
                    numericValue: rating,
                    rankPosition: null
                }));
            }
            else if (survey.surveyType === 'MATRIX') {
                voteValues = Object.entries(matrixValues)
                    .filter(([key, value]) => value)
                    .map(([key]) => {
                        const [optionId, columnIndex] = key.split('_');
                        return {
                            surveyOptionId: optionId,
                            numericValue: parseInt(columnIndex),
                            rankPosition: null
                        };
                    });
            }
            else if (survey.surveyType === 'MULTIPLE_CHOICE') {
                voteValues = selectedOptions.map(optionId => ({
                    surveyOptionId: optionId,
                    numericValue: null,
                    rankPosition: null
                }));
            }
            else if (survey.surveyType === 'RANKING') {
                voteValues = rankingOrder.map((optionId, index) => ({
                    surveyOptionId: optionId,
                    numericValue: null,
                    rankPosition: index
                }));
            }

            // Skip if no values to submit
            if (voteValues.length === 0) {
                snackbar("Будь ласка, виберіть хоча б один варіант", "error");
                return;
            }

            // Используем универсальный формат запроса
            const response = await vote({
                surveyId: id,
                voteValues: voteValues
            });

            if (response.error) {
                snackbar(response.error.data?.message || "Не вдалося зберегти вашу відповідь", "error");
            } else {
                snackbar(response.data?.message || "Ваша відповідь врахована!", "success");
                await refetch();
            }
        } catch (error) {
            console.error("Voting error:", error);
            snackbar("Сталася непередбачена помилка", "error");
        }
    };

    // Handler for rating scale changes
    const handleRatingChange = (optionId, newValue) => {
        setRatingValues(prev => ({
            ...prev,
            [optionId]: newValue
        }));
    };

    // Handler for matrix option changes
    const handleMatrixChange = (optionId, columnIndex) => {
        // First remove any existing selection for this row
        const updatedValues = { ...matrixValues };
        Object.keys(updatedValues).forEach(key => {
            if (key.startsWith(`${optionId}_`)) {
                delete updatedValues[key];
            }
        });

        // Add the new selection
        updatedValues[`${optionId}_${columnIndex}`] = true;
        setMatrixValues(updatedValues);
    };

    // Handler for multiple choice option changes
    const handleMultipleChoiceChange = (optionId) => {
        setSelectedOptions(prev => {
            if (prev.includes(optionId)) {
                return prev.filter(id => id !== optionId);
            } else {
                return [...prev, optionId];
            }
        });
    };

    // Handler for drag and drop in ranking
    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(rankingOrder);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setRankingOrder(items);
    };

    if (isLoading) {
        return (
            <Container maxWidth="md" sx={{ px: { xs: 2, md: 3 } }}>
                <IconButton
                    onClick={handleBack}
                    sx={{ mt: { xs: 1.5, sm: 2 }, mb: { xs: 1.5, sm: 2 } }}
                >
                    <ArrowBackIcon />
                </IconButton>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 2, md: 4 } }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (!surveyData) {
        return (
            <Container maxWidth="md" sx={{ px: { xs: 2, md: 3 } }}>
                <IconButton
                    onClick={handleBack}
                    sx={{ mt: { xs: 1.5, sm: 2 }, mb: { xs: 1.5, sm: 2 } }}
                >
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h5" color="error" align="center" sx={{ mt: { xs: 2, sm: 4 }, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
                    Опитування не знайдено
                </Typography>
            </Container>
        );
    }

    const canSendMessage = currentUser && !isOwner;
    const canViewMessages = isOwner;

    // Colors for charts
    const COLORS = [
        '#1976d2', '#00bcd4', '#43e97b', '#38f9d7', '#ffb347', '#ff7043', '#ff5e62', '#a18cd1', '#fbc2eb', '#fad0c4',
        '#f7971e', '#ffd200', '#21d4fd', '#b721ff', '#fa709a', '#fee140', '#fa709a', '#30cfd0', '#a8edea', '#fcb69f'
    ];
    const COLORS_GRADIENT = [
        'url(#barGradient1)', 'url(#barGradient2)', 'url(#barGradient3)', 'url(#barGradient4)', 'url(#barGradient5)'
    ];

    // Render survey content based on type
    const renderSurveyContent = () => {
        if (!survey) return null;

        switch (survey.surveyType) {
            case 'SINGLE_CHOICE':
                return (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Оберіть один варіант:
                        </Typography>
                        {currentUser ? (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: 2,
                                    mt: 2,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '100%',
                                }}
                            >
                                {survey.options.map((option) => (
                                    <Button
                                        key={option.id}
                                        variant={surveyData?.vote?.surveyOptionId === option.id ? 'contained' : 'outlined'}
                                        color={surveyData?.vote?.surveyOptionId === option.id ? 'primary' : 'inherit'}
                                        onClick={() => handleVote(option)}
                                        disabled={!survey.open || isVoting || !!surveyData?.vote}
                                        sx={{ minWidth: 180, fontWeight: 600, fontSize: 18, py: 1.5, mx: { sm: 1, xs: 0 }, width: { xs: '100%', sm: 'auto' } }}
                                    >
                                        {option.name}
                                    </Button>
                                ))}
                            </Box>
                        ) : (
                            <Typography color="text.secondary" sx={{ mt: 2, textAlign: 'center', fontSize: 16 }}>
                                Щоб проголосувати, будь ласка, увійдіть у систему.
                            </Typography>
                        )}
                    </Box>
                );

            case 'MULTIPLE_CHOICE':
                return (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Оберіть один або декілька варіантів:
                        </Typography>
                        <FormGroup>
                            {survey.options.map((option) => (
                                <FormControlLabel
                                    key={option.id}
                                    control={
                                        <Checkbox
                                            checked={selectedOptions.includes(option.id)}
                                            onChange={() => handleMultipleChoiceChange(option.id)}
                                            disabled={!survey.open || isVoting || !!surveyData?.vote}
                                        />
                                    }
                                    label={option.name}
                                />
                            ))}
                        </FormGroup>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={!survey.open || isVoting || selectedOptions.length === 0 || !!surveyData?.vote}
                                onClick={handleAdvancedVote}
                            >
                                {isVoting ? <CircularProgress size={24} /> : "Проголосувати"}
                            </Button>
                        </Box>
                    </Box>
                );

            case 'RATING_SCALE':
                return (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Оцініть кожний варіант (від {survey.minRating} до {survey.maxRating}):
                        </Typography>
                        {survey.options.map((option) => (
                            <Box key={option.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Typography variant="body1" sx={{ minWidth: 150, mr: 2 }}>
                                    {option.name}:
                                </Typography>
                                <Rating
                                    name={`rating-${option.id}`}
                                    value={ratingValues[option.id] || 0}
                                    onChange={(event, newValue) => handleRatingChange(option.id, newValue)}
                                    max={survey.maxRating}
                                    disabled={!survey.open || isVoting || !!surveyData?.vote}
                                />
                                <Typography variant="body2" sx={{ ml: 1 }}>
                                    {ratingValues[option.id] || 0}
                                </Typography>
                            </Box>
                        ))}

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={!survey.open || isVoting || Object.keys(ratingValues).length === 0 || !!surveyData?.vote}
                                onClick={handleAdvancedVote}
                                sx={{ mt: 2 }}
                            >
                                {isVoting ? <CircularProgress size={24} /> : "Проголосувати"}
                            </Button>
                        </Box>
                    </Box>
                );

            case 'MATRIX':
                // Parse matrixColumns
                const matrixColumns = survey.matrixColumns || [];

                return (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Заповніть матрицю відповідей:
                        </Typography>

                        <TableContainer component={Paper} sx={{ mt: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        {matrixColumns.map((column, index) => (
                                            <TableCell key={index} align="center">{column}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {survey.options.map((option) => (
                                        <TableRow key={option.id}>
                                            <TableCell component="th" scope="row">
                                                {option.name}
                                            </TableCell>
                                            {matrixColumns.map((_, colIndex) => (
                                                <TableCell key={colIndex} align="center">
                                                    <Radio
                                                        checked={matrixValues[`${option.id}_${colIndex}`] === true}
                                                        onChange={() => handleMatrixChange(option.id, colIndex)}
                                                        disabled={!survey.open || isVoting || !!surveyData?.vote}
                                                    />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={!survey.open || isVoting || Object.keys(matrixValues).length === 0 || !!surveyData?.vote}
                                onClick={handleAdvancedVote}
                                sx={{ mt: 2 }}
                            >
                                {isVoting ? <CircularProgress size={24} /> : "Проголосувати"}
                            </Button>
                        </Box>
                    </Box>
                );

            case 'RANKING':
                return (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Перетягніть варіанти у потрібному порядку (від найбільш до найменш бажаного):
                        </Typography>
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="droppable">
                                {(provided) => (
                                    <Box
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        sx={{ mt: 2 }}
                                    >
                                        {rankingOrder.map((optionId, index) => {
                                            const option = survey.options.find(o => o.id === optionId);
                                            if (!option) return null;

                                            return (
                                                <Draggable
                                                    key={option.id}
                                                    draggableId={option.id}
                                                    index={index}
                                                    isDragDisabled={!survey.open || isVoting || !!surveyData?.vote}
                                                >
                                                    {(provided) => (
                                                        <Box
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            sx={{
                                                                p: 2,
                                                                mb: 1,
                                                                borderRadius: 1,
                                                                bgcolor: surveyData?.vote ? 'rgba(0, 0, 0, 0.05)' : 'background.paper',
                                                                boxShadow: 1,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                opacity: surveyData?.vote ? 0.8 : 1,
                                                                cursor: surveyData?.vote ? 'default' : 'grab',
                                                                position: 'relative',
                                                                '&::after': surveyData?.vote ? {
                                                                    content: '""',
                                                                    position: 'absolute',
                                                                    top: 0,
                                                                    left: 0,
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    backgroundColor: 'rgba(0, 0, 0, 0.03)',
                                                                    pointerEvents: 'none',
                                                                    borderRadius: 1
                                                                } : {}
                                                            }}
                                                        >
                                                            <Box sx={{ mr: 2, color: 'text.secondary' }}>
                                                                {index + 1}.
                                                            </Box>
                                                            <Typography variant="body1">
                                                                {option.name}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Draggable>
                                            );
                                        })}
                                        {provided.placeholder}
                                    </Box>
                                )}
                            </Droppable>
                        </DragDropContext>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={!survey.open || isVoting || !!surveyData?.vote}
                                onClick={handleAdvancedVote}
                                sx={{ mt: 2 }}
                            >
                                {isVoting ? <CircularProgress size={24} /> : "Проголосувати"}
                            </Button>
                        </Box>
                    </Box>
                );

            default:
                return null;
        }
    };

    return (
        <Container maxWidth="md" sx={{ pb: 4, px: { xs: 2, md: 3 } }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'center',
                flexDirection: isMobile ? 'column' : 'row',
                mt: { xs: 1.5, sm: 2 },
                mb: { xs: 1.5, sm: 2 },
                gap: isMobile ? 1 : 0
            }}>
                <IconButton onClick={handleBack} sx={{ alignSelf: isMobile ? 'flex-start' : 'center' }}>
                    <ArrowBackIcon />
                </IconButton>
                {isOwner && (
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: { xs: 1, sm: 2 },
                        width: isMobile ? '100%' : 'auto',
                        justifyContent: isMobile ? 'flex-end' : 'flex-start'
                    }}>
                        <Chip
                            label="Моє"
                            color="primary"
                            sx={{
                                fontWeight: 'bold',
                                fontSize: { xs: 14, sm: 16 }
                            }}
                        />
                        <IconButton onClick={() => setShowQrModal(true)} color="primary" sx={{ ml: 1 }}>
                            <QrCode2Icon />
                        </IconButton>
                        {!survey.open && (
                            <IconButton onClick={handleExportExcel} color="primary" sx={{ ml: 1 }}>
                                <FileDownloadOutlinedIcon />
                            </IconButton>
                        )}
                        <IconButton color="primary" onClick={() => setEditDialogOpen(true)}>
                            <EditIcon />
                        </IconButton>
                        <Button
                            variant="outlined"
                            color={survey.open ? "success" : "error"}
                            startIcon={survey.open ? <LockOpenIcon /> : <LockIcon />}
                            onClick={() => setToggleDialogOpen(true)}
                            disabled={Boolean(isUpdating)}
                            sx={{
                                ml: { xs: 0, sm: 1 },
                                fontSize: { xs: '0.8rem', sm: '0.875rem' }
                            }}
                            size={isSmallMobile ? "small" : "medium"}
                        >
                            {survey.open ? "Відкрито" : "Закрито"}
                        </Button>
                        <IconButton color="error" onClick={() => setDeleteDialogOpen(true)}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                )}
            </Box>
            <Paper
                elevation={3}
                sx={{
                    borderRadius: { xs: 1, sm: 2 },
                    overflow: 'hidden',
                    backgroundColor: 'white.main',
                    color: 'text.primary',
                }}
            >
                <Box sx={{
                    position: 'relative',
                    width: '100%',
                    height: { xs: 200, sm: 250, md: 300 }
                }}>
                    {survey.imageUrl ? (
                        <CardMedia
                            component="img"
                            image={imageSrc}
                            alt={survey.title}
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    ) : (
                        <Box sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'background.paper',
                        }}>
                            <Box sx={{ pointerEvents: 'none' }}>
                                <LogoAvatar sx={{ width: 170, height: 170, fontSize: 72, borderWidth: 6, borderColor: 'primary.main', borderStyle: 'solid' }} />
                            </Box>
                        </Box>
                    )}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                            p: { xs: 2, sm: 3 },
                            color: 'white'
                        }}
                    >
                    </Box>
                </Box>

                <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                    {/* Title and views under the image */}
                    <Typography
                        variant="h3"
                        sx={{
                            mb: 2,
                            fontWeight: 700,
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '2.8rem' },
                            fontFamily: 'Montserrat, Arial, sans-serif',
                            color: 'text.primary',
                            lineHeight: 1.1
                        }}
                    >
                        {survey.title}
                    </Typography>
                    <Typography
                        variant="h5"
                        color="text.secondary"
                        sx={{
                            mb: { xs: 2, sm: 3, md: 4 },
                            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                            fontWeight: 400,
                            color: 'text.secondary',
                        }}
                    >
                        {survey.subtitle}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, mb: 2 }}>
                        <Chip
                            icon={<HowToVoteIcon />}
                            label={`Голосів: ${survey.votesCount ?? 0}`}
                            color="primary"
                            sx={{ fontWeight: 600, fontSize: 16 }}
                        />
                        {isOwner && (
                            <Chip
                                icon={<ChatBubbleOutlineIcon />}
                                label={`Повідомлень: ${survey.messagesCount ?? 0}`}
                                color="secondary"
                                sx={{ fontWeight: 600, fontSize: 16 }}
                            />
                        )}
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        gap: { xs: 1.5, sm: 2, md: 3 },
                        mb: { xs: 2, sm: 3, md: 4 },
                        flexWrap: 'wrap',
                        p: { xs: 1, sm: 2 },
                        bgcolor: 'background.paper',
                        borderRadius: 1,
                        boxShadow: '0 0 10px rgba(0,0,0,0.05)'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: { xs: 1, sm: 2 },
                            flex: '1 1 auto',
                            minWidth: { xs: '100%', sm: 'calc(50% - 16px)', md: '200px' }
                        }}>
                            <Avatar
                                src={survey.user.avatarUrl}
                                sx={{
                                    width: { xs: 40, sm: 48 },
                                    height: { xs: 40, sm: 48 },
                                    bgcolor: 'primary.main'
                                }}
                            >
                                {survey.user.nickname.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                    sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
                                >
                                    Створено
                                </Typography>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 'medium',
                                        fontSize: { xs: '0.9rem', sm: '1rem' },
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    {survey.user.nickname}
                                </Typography>
                            </Box>
                        </Box>

                        {!isSmallMobile && <Divider orientation="vertical" flexItem />}
                        {isSmallMobile && <Divider flexItem />}

                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            flex: { xs: '1 1 100%', sm: '1 1 auto' },
                            minWidth: { xs: '100%', sm: 'auto' }
                        }}>
                            <CalendarTodayIcon color="primary" sx={{ fontSize: { xs: 18, sm: 24 } }} />
                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                    sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
                                >
                                    Створено
                                </Typography>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 'medium',
                                        fontSize: { xs: '0.9rem', sm: '1rem' }
                                    }}
                                >
                                    {formatDate(survey.createdAt)}
                                </Typography>
                            </Box>
                        </Box>

                        {!isSmallMobile && <Divider orientation="vertical" flexItem />}
                        {isSmallMobile && <Divider flexItem />}

                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            flex: { xs: '1 1 100%', sm: '1 1 auto' },
                            minWidth: { xs: '100%', sm: 'auto' }
                        }}>
                            <HowToVoteIcon color="primary" sx={{ fontSize: { xs: 18, sm: 24 } }} />
                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                    sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
                                >
                                    Статус
                                </Typography>
                                <Chip
                                    label={survey.open ? "Відкрито" : "Закрито"}
                                    color={survey.open ? "success" : "error"}
                                    size="small"
                                    sx={{
                                        fontWeight: 'bold',
                                        '& .MuiChip-label': {
                                            px: 1
                                        },
                                        fontSize: { xs: '0.7rem', sm: '0.8rem' }
                                    }}
                                />
                            </Box>
                        </Box>

                        {survey.totalVotes !== undefined && (
                            <>
                                {!isSmallMobile && <Divider orientation="vertical" flexItem />}
                                {isSmallMobile && <Divider flexItem />}
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    flex: { xs: '1 1 100%', sm: '1 1 auto' },
                                    minWidth: { xs: '100%', sm: 'auto' }
                                }}>
                                    <VisibilityIcon color="primary" sx={{ fontSize: { xs: 18, sm: 24 } }} />
                                    <Box>
                                        <Typography
                                            variant="subtitle2"
                                            color="text.secondary"
                                            sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
                                        >
                                            Загальна кількість голосів
                                        </Typography>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                fontWeight: 'medium',
                                                fontSize: { xs: '0.9rem', sm: '1rem' }
                                            }}
                                        >
                                            {survey.totalVotes}
                                        </Typography>
                                    </Box>
                                </Box>
                            </>
                        )}

                        {survey.views !== undefined && (
                            <>
                                {!isSmallMobile && <Divider orientation="vertical" flexItem />}
                                {isSmallMobile && <Divider flexItem />}
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    flex: { xs: '1 1 100%', sm: '1 1 auto' },
                                    minWidth: { xs: '100%', sm: 'auto' }
                                }}>
                                    <VisibilityIcon color="primary" sx={{ fontSize: { xs: 18, sm: 24 } }} />
                                    <Box>
                                        <Typography
                                            variant="subtitle2"
                                            color="text.secondary"
                                            sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
                                        >
                                            Переглядів
                                        </Typography>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                fontWeight: 'medium',
                                                fontSize: { xs: '0.9rem', sm: '1rem' }
                                            }}
                                        >
                                            {survey.views}
                                        </Typography>
                                    </Box>
                                </Box>
                            </>
                        )}

                        {survey.expirationDate && (
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: { xs: 1, sm: 2 },
                                flex: '1 1 auto',
                                minWidth: { xs: '100%', sm: 'calc(50% - 16px)', md: '200px' }
                            }}>
                                <AccessTimeIcon color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    Закривається {formatExpirationDate(survey.expirationDate)}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                    {survey.open && (
                        <Box sx={{ mt: { xs: 2, sm: 3, md: 4 } }}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: { xs: 'flex-start', sm: 'center' },
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: { xs: 1, sm: 0 },
                                mb: { xs: 2, sm: 3 }
                            }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 'bold',
                                        fontSize: { xs: '1.1rem', sm: '1.25rem' }
                                    }}
                                >
                                    Варіанти відповідей
                                </Typography>
                                {currentUser && surveyData.vote && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={handleUnvote}
                                        disabled={Boolean(isUnvoting)}
                                        size={isSmallMobile ? "small" : "medium"}
                                        sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                                    >
                                        Видалити мою відповідь
                                    </Button>
                                )}
                            </Box>
                            {renderSurveyContent()}
                        </Box>
                    )}

                    {/* Charts section - unified across all survey types */}
                    {!survey.open && (
                        <Box sx={{ mt: 3 }}>
                            {/* Line Chart for all survey types */}
                            <ChartContainer
                                chartType="line"
                                survey={survey}
                                votes={surveyData.votes}
                                formatDateTick={formatDateTick}
                                votesByDate={votesByDate}
                            />

                            {/* Pie and Bar charts side by side */}
                            <Box sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                gap: { xs: 3, md: 4 },
                                mb: { xs: 3, md: 4 },
                                mt: { xs: 4, md: 5 },
                                alignItems: 'stretch',
                                justifyContent: 'center',
                            }}>
                                <ChartContainer
                                    chartType="pie"
                                    survey={survey}
                                    votes={surveyData.votes}
                                />

                                <ChartContainer
                                    chartType="bar"
                                    survey={survey}
                                    votes={surveyData.votes}
                                    maxRating={survey.maxRating}
                                />
                            </Box>

                            {/* Word Cloud and Stacked Bar side by side */}
                            <Box sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                gap: { xs: 3, md: 4 },
                                mb: { xs: 3, md: 4 },
                                alignItems: 'stretch',
                                justifyContent: 'center',
                            }}>
                                {/* Word Cloud for all survey types */}
                                <ChartContainer
                                    chartType="wordcloud"
                                    survey={survey}
                                    votes={surveyData.votes}
                                />

                                {/* 100% Stacked Bar Chart */}
                                <Box sx={{ flex: 1, minWidth: 260 }}>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            fontWeight: 600,
                                            color: 'primary.main',
                                            textAlign: 'center',
                                            mb: { xs: 1, md: 0 },
                                            mt: { xs: 2, md: 0 }
                                        }}
                                    >
                                        Відсоток проголосувавших від переглядів (100% Stacked Bar)
                                    </Typography>
                                    <Box sx={{ height: { xs: 180, md: 220 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <svg width="0" height="0">
                                            <defs>
                                                <linearGradient id="stackedBar1" x1="0" y1="0" x2="1" y2="1">
                                                    <stop offset="0%" stopColor="#1976d2" />
                                                    <stop offset="100%" stopColor="#43e97b" />
                                                </linearGradient>
                                                <linearGradient id="stackedBar2" x1="0" y1="0" x2="1" y2="1">
                                                    <stop offset="0%" stopColor="#bdbdbd" />
                                                    <stop offset="100%" stopColor="#fbc2eb" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                id="stacked-bar-chart-export"
                                                data={[(() => {
                                                    const totalVotes = survey.votesCount ?? 0;
                                                    const views = survey.views || 0;
                                                    const percentVotes = views > 0 ? (totalVotes / views) * 100 : 0;
                                                    return {
                                                        name: survey.title.length > 18 ? survey.title.slice(0, 18) + '…' : survey.title,
                                                        Голоси: percentVotes,
                                                        'Без голосу': Math.max(0, 100 - percentVotes),
                                                        absVotes: totalVotes,
                                                        absNoVote: Math.max(0, views - totalVotes),
                                                        absViews: views
                                                    };
                                                })()]}
                                                barCategoryGap={80}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" tick={{ fontWeight: 'bold', fontSize: 13 }} />
                                                <YAxis
                                                    tickFormatter={(value) => `${value.toFixed(0)}%`}
                                                    domain={[0, 100]}
                                                />
                                                <Tooltip
                                                    formatter={(value, name, props) => {
                                                        if (name === 'Голоси') {
                                                            return [`${props.payload.absVotes} (${value.toFixed(1)}%)`, 'Голоси'];
                                                        }
                                                        if (name === 'Без голосу') {
                                                            return [`${props.payload.absNoVote} (${value.toFixed(1)}%)`, 'Без голосу'];
                                                        }
                                                        return value;
                                                    }}
                                                />
                                                <Legend wrapperStyle={{ fontSize: 13, paddingTop: 0, marginTop: -8 }} iconSize={12} height={24} />
                                                <Bar dataKey="Голоси" stackId="a" fill="url(#stackedBar1)" isAnimationActive={false} barSize={100} />
                                                <Bar dataKey="Без голосу" stackId="a" fill="url(#stackedBar2)" isAnimationActive={false} barSize={100} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </Box>
                            </Box>

                            {/* Specialized charts based on survey type */}
                            {survey.surveyType === 'MATRIX' && (
                                <Box sx={{ mt: 4, mb: 4 }}>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            fontWeight: 600,
                                            color: 'primary.main',
                                            textAlign: 'center',
                                            mb: 2
                                        }}
                                    >
                                        Матриця відповідей (Heatmap)
                                    </Typography>
                                    <TableContainer component={Paper} sx={{ overflow: 'auto' }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell></TableCell>
                                                    {survey.matrixColumns && survey.matrixColumns.map((column, colIndex) => (
                                                        <TableCell key={colIndex} align="center" sx={{ fontWeight: 'bold' }}>
                                                            {column}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {survey.options.map(option => {
                                                    // Calculate response distribution for this row
                                                    const responseDistribution = Array(survey.matrixColumns?.length || 0).fill(0);

                                                    if (surveyData?.votes) {
                                                        surveyData.votes.forEach(vote => {
                                                            const voteValue = vote.voteValues?.find(v => v.surveyOptionId === option.id);
                                                            if (voteValue && typeof voteValue.numericValue === 'number') {
                                                                responseDistribution[voteValue.numericValue]++;
                                                            }
                                                        });
                                                    }

                                                    const maxVotes = Math.max(...responseDistribution, 1);

                                                    return (
                                                        <TableRow key={option.id}>
                                                            <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                                                                {option.name}
                                                            </TableCell>
                                                            {responseDistribution.map((count, colIndex) => {
                                                                const intensity = count / maxVotes;

                                                                return (
                                                                    <TableCell
                                                                        key={colIndex}
                                                                        align="center"
                                                                        sx={{
                                                                            bgcolor: `rgba(25, 118, 210, ${intensity * 0.8})`,
                                                                            color: intensity > 0.5 ? 'white' : 'black',
                                                                            fontWeight: 'bold',
                                                                            position: 'relative'
                                                                        }}
                                                                    >
                                                                        {count}
                                                                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                                                                            {((count / (surveyData?.votes?.length || 1)) * 100).toFixed(1)}%
                                                                        </Typography>
                                                                    </TableCell>
                                                                );
                                                            })}
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            )}

                            {survey.surveyType === 'RANKING' && (
                                <Box sx={{ mt: 4, mb: 4 }}>
                                    <RankingPositionTable
                                        survey={survey}
                                        surveyData={surveyData}
                                    />
                                </Box>
                            )}

                            {/* Messages section */}
                            {!isOwner && (
                                <Box sx={{ mt: 6 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                        Повідомлення для автора опитування
                                    </Typography>
                                    {canSendMessage ? (
                                        <form onSubmit={handleSendMessage} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                                            <>
                                                <textarea
                                                    value={messageContent}
                                                    onChange={e => setMessageContent(e.target.value)}
                                                    rows={3}
                                                    maxLength={MAX_MESSAGE_LENGTH}
                                                    placeholder="Залиште повідомлення..."
                                                    style={{ resize: 'vertical', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
                                                    disabled={isAddingMessage}
                                                />
                                                <Typography variant="caption" color={messageContent.length > MAX_MESSAGE_LENGTH ? 'error' : 'text.secondary'}>
                                                    {messageContent.length}/{MAX_MESSAGE_LENGTH} символів
                                                </Typography>
                                                {messageError && <Typography color="error" variant="body2">{messageError}</Typography>}
                                                <Button type="submit" variant="contained" color="primary" disabled={Boolean(isAddingMessage || !messageContent.trim())}>
                                                    Надіслати
                                                </Button>
                                            </>
                                        </form>
                                    ) : (
                                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                                            Тільки авторизовані користувачі можуть залишати повідомлення.
                                        </Typography>
                                    )}
                                </Box>
                            )}
                            {canViewMessages && (
                                <Box sx={{ mt: 6 }}>
                                    <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: 'primary.main', textAlign: 'center', letterSpacing: 0.5 }}>
                                        Повідомлення
                                    </Typography>
                                    {messages && messages.length > 0 ? (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            {messages.map(msg => (
                                                <Paper key={msg.id} sx={{ p: 2, mb: 1, bgcolor: 'grey.50' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', mr: 1 }}>
                                                            {msg.user?.nickname?.charAt(0)?.toUpperCase()}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{msg.user?.nickname}</Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {new Date(msg.createdAt).toLocaleString()}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Typography variant="body1" sx={{ mt: 1, whiteSpace: 'pre-line' }}>{msg.content}</Typography>
                                                </Paper>
                                            ))}
                                        </Box>
                                    ) : (
                                        <Typography color="text.secondary" sx={{ textAlign: 'center', my: 4, fontSize: { xs: '1.1rem', sm: '1.2rem' } }}>
                                            Повідомлень ще немає.
                                        </Typography>
                                    )}
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>
            </Paper>

            <SurveyQrModal open={showQrModal} onClose={() => setShowQrModal(false)} voteUrl={voteUrl} />

            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Редагування опитування</DialogTitle>
                <DialogContent>
                    <Typography>
                        Після редагування опитування всі голоси, повідомлення та перегляди будуть скинуті. Ви впевнені, що хочете продовжити?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Скасувати</Button>
                    <Button color="warning" variant="contained" onClick={() => { setEditDialogOpen(false); navigate(`/edit-survey/${survey.id}`); }}>Редагувати</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={toggleDialogOpen} onClose={() => setToggleDialogOpen(false)}>
                <DialogTitle>{survey.open ? 'Закрити опитування?' : 'Відкрити опитування?'}</DialogTitle>
                <DialogContent>
                    {survey.open ? (
                        <Typography>
                            Після закриття опитування всі голоси стануть анонімними, і дані відновити буде неможливо. Ви впевнені, що хочете закрити опитування?
                        </Typography>
                    ) : (
                        <Typography>
                            Після повторного відкриття опитування всі голоси, перегляди та коментарі будуть скинуті. Ви впевнені, що хочете відкрити опитування знову?
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setToggleDialogOpen(false)}>Скасувати</Button>
                    <Button color="warning" variant="contained" onClick={() => { setToggleDialogOpen(false); handleToggleStatus(); }}>Підтвердити</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Видалити опитування</DialogTitle>
                <DialogContent>
                    <Typography>
                        Ви впевнені, що хочете видалити опитування? Цю дію неможливо скасувати.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Скасувати</Button>
                    <Button color="error" variant="contained" onClick={() => { setDeleteDialogOpen(false); /* TODO: handle delete */ }}>
                        Видалити
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={showExpirationDialog} onClose={() => setShowExpirationDialog(false)}>
                <DialogTitle>Оновити дату закриття</DialogTitle>
                <DialogContent>
                    <Typography sx={{ mb: 2 }}>
                        Дата закриття опитування вже минула. Щоб знову відкрити опитування, виберіть нову дату закриття у майбутньому або відкрийте без дати закриття.
                    </Typography>
                    <TextField
                        type="datetime-local"
                        value={newExpirationDate || ''}
                        onChange={e => setNewExpirationDate(e.target.value)}
                        sx={{ width: '100%' }}
                        InputLabelProps={{ shrink: true }}
                    />
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Button variant="outlined" size="small" onClick={() => {
                            // Set expiration to now + 1 hour (Kyiv time)
                            const now = new Date();
                            now.setHours(now.getHours() + 1);
                            setNewExpirationDate(now.toISOString().slice(0, 16));
                        }}>
                            Поставити зараз
                        </Button>
                        <Button variant="outlined" size="small" onClick={() => setNewExpirationDate(null)}>
                            Очистити дату
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowExpirationDialog(false)}>Скасувати</Button>
                    <Button color="primary" variant="outlined" onClick={async () => {
                        setShowExpirationDialog(false);
                        try {
                            const { error } = await updateSurvey({
                                id: survey.id,
                                data: {
                                    ...survey,
                                    open: true,
                                    expirationDate: null
                                }
                            });
                            if (error) {
                                snackbar(error.data.message || "Сталася помилка при оновленні опитування", "error");
                            } else {
                                snackbar("Опитування відкрито", "success");
                                setSelectedOption(null);
                                await refetch();
                            }
                        } catch (error) {
                            snackbar("Сталася непередбачена помилка", "error");
                        }
                    }}>Відкрити без дати закриття</Button>
                    <Button color="primary" variant="contained" onClick={async () => {
                        setShowExpirationDialog(false);
                        try {
                            const { error } = await updateSurvey({
                                id: survey.id,
                                data: {
                                    ...survey,
                                    open: true,
                                    expirationDate: newExpirationDate
                                }
                            });
                            if (error) {
                                snackbar(error.data.message || "Сталася помилка при оновленні опитування", "error");
                            } else {
                                snackbar("Опитування відкрито", "success");
                                setSelectedOption(null);
                                await refetch();
                            }
                        } catch (error) {
                            snackbar("Сталася непередбачена помилка", "error");
                        }
                    }}>Оновити дату і відкрити</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}