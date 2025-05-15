import { LogoAvatar } from '@components/ui/LogoAvatar.jsx';
import useBottomSnackbar from "@components/ui/snackbars/BottomSnackbar.jsx";
import useResponsive from "@hooks/useResponsive";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ShareIcon from '@mui/icons-material/Share';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import PropTypes from "prop-types";
import { memo, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import { useGetSurveyImageQuery } from "src/services/store/api/surveyApi";
import { useDeleteSurveyMutation, useUpdateSurveyMutation } from "src/services/store/api/surveyApi.jsx";
import { selectIsAdmin, selectIsOwner, selectUser } from "src/services/store/slices/userSlice.jsx";

// Styles defined outside component to prevent recreation on each render
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
    height: '180px',
    display: 'flex',
    flexDirection: 'column'
});

const ImageOverlay = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '140px',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    '.MuiCard-root:hover &': {
        opacity: 1
    },
    zIndex: 1,
    color: 'white',
}));

// Common styles to avoid recreation
const imageStyles = {
    height: 140,
    width: '100%',
    objectFit: 'cover',
};

const creatorChipStyles = {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2
};

const actionBoxStyles = {
    position: 'absolute',
    bottom: 10,
    right: 16,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '4px',
    padding: '4px',
    zIndex: 1
};

function formatExpirationDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year}, ${hours}:${minutes}`;
}

const SurveyCardComponent = ({ survey, onMouseEnter, onMouseLeave, refetch, onDelete }) => {
    const { title, subtitle, id, createdAt, open, user, views, expirationDate } = survey;
    const snackbar = useBottomSnackbar();
    const currentUser = useSelector(selectUser);
    const isAdmin = useSelector(selectIsAdmin);
    const isMy = useSelector(state => selectIsOwner(state, user.id));
    const canEdit = isAdmin && isMy;
    const [deleteSurvey] = useDeleteSurveyMutation();
    const [updateSurvey] = useUpdateSurveyMutation();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const { isMobile } = useResponsive();
    const [imageSrc, setImageSrc] = useState(null);
    const cardRef = useRef(null);
    const [hovered, setHovered] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const navigate = useNavigate();
    const [toggleDialogOpen, setToggleDialogOpen] = useState(false);
    const [toggleAction, setToggleAction] = useState(null);
    const [loadingToggle, setLoadingToggle] = useState(false);

    // Extract fileName from imageUrl
    let fileName = null;
    if (survey.imageUrl) {
        const parts = survey.imageUrl.split('/');
        fileName = parts[parts.length - 1];
    }

    const { data: fileData, isSuccess } = useGetSurveyImageQuery(fileName, { skip: !fileName });

    useEffect(() => {
        if (isSuccess && fileData) {
            setImageSrc(fileData);
        } else {
            setImageSrc(null);
        }
    }, [isSuccess, fileData, fileName]);

    const handleShare = () => {
        const surveyUrl = `${window.location.origin}/surveys/${id}`;
        navigator.clipboard.writeText(surveyUrl).then(() => {
            snackbar("Посилання на опитування скопійовано в буфер обміну!", "success");
        });
    };

    const handleDelete = async () => {
        try {
            const { error } = await deleteSurvey(id);
            if (error) {
                snackbar(error.data.message || "Не вдалося видалити опитування", "error");
            } else {
                snackbar("Опитування видалено успішно!", "success");
                setDeleteDialogOpen(false);
                if (onDelete) onDelete(id);
            }
        } catch (error) {
            snackbar("Сталася непередбачена помилка", "error");
            console.error(error);
        }
    };

    const handleToggleStatus = async () => {
        setLoadingToggle(true);
        try {
            // Вместо useGetSurveyQuery используем данные из props
            const fullSurvey = survey;

            if (!fullSurvey || !Array.isArray(fullSurvey.options) || fullSurvey.options.length < 2) {
                snackbar('Опитування повинно містити щонайменше 2 варіанти відповіді', 'error');
                setLoadingToggle(false);
                return;
            }
            const { error } = await updateSurvey({
                id: survey.id,
                data: {
                    ...fullSurvey,
                    open: !fullSurvey.open
                }
            });
            if (error) {
                snackbar(error.data.message || "Сталася помилка при оновленні опитування", "error");
            } else {
                snackbar(fullSurvey.open ? "Опитування закрито" : "Опитування відкрито", "success");
                if (refetch) refetch();
            }
        } catch (error) {
            snackbar("Сталася непередбачена помилка", "error");
            console.error(error);
        } finally {
            setLoadingToggle(false);
        }
    };

    // Format date outside of render
    const formattedDate = new Date(createdAt).toLocaleDateString();

    // --- 3D-анимация ---
    const handleCardMouseEnter = () => setHovered(true);
    const handleCardMouseLeave = () => setHovered(false);

    return (
        <>
            <Box
                ref={cardRef}
                sx={{
                    perspective: 1000,
                    width: { xs: '100%', sm: 340, md: 340 },
                    minWidth: { xs: '100%', sm: 340, md: 340 },
                    maxWidth: { xs: '100%', sm: 340, md: 340 },
                    minHeight: 440,
                    height: '100%',
                    position: 'relative',
                    transition: 'all 0.3s',
                    mx: 'auto',
                }}
                onMouseEnter={handleCardMouseEnter}
                onMouseLeave={handleCardMouseLeave}
            >
                {/* Вспливаюча табличка зверху */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 24,
                        left: 0,
                        width: '100%',
                        zIndex: 40,
                        display: 'flex',
                        justifyContent: 'center',
                        opacity: hovered ? 1 : 0,
                        pointerEvents: 'none',
                        transition: 'opacity 0.4s, transform 0.4s',
                        transform: hovered ? 'translateY(0)' : 'translateY(-40px)',
                    }}
                >
                    <Box sx={{
                        px: 3,
                        py: 2,
                        borderRadius: 3,
                        fontSize: { xs: '1rem', md: '1.1rem' },
                        color: '#fff',
                        bgcolor: 'rgba(20,20,20,0.85)',
                        boxShadow: 6,
                        minWidth: 220,
                        maxWidth: 320,
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                    }}>
                        <Typography variant="body2" fontWeight={600} sx={{ color: '#fff' }}>{user.nickname}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <CalendarTodayIcon fontSize="small" sx={{ color: '#fff' }} />
                            <Typography variant="body2" sx={{ color: '#fff' }}>{formattedDate}</Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Карточка з 3D-анімацією */}
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        transition: 'transform 0.5s',
                        transformStyle: 'preserve-3d',
                        transform: hovered
                            ? 'rotateX(35deg) scale(0.90) translateY(30px)'
                            : 'none',
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            minHeight: 400,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1.2,
                            borderRadius: 5,
                            p: 1.5,
                            boxShadow: 2,
                            border: '1px solid',
                            borderColor: 'rgba(0,0,0,0.10)',
                            backdropFilter: 'blur(12px)',
                            background: 'linear-gradient(to bottom, rgba(255,255,255,0.20), rgba(255,255,255,0.30))',
                            transition: 'all 0.5s',
                            position: 'relative',
                        }}
                    >
                        {/* Картинка або логотип */}
                        {survey.imageUrl && imageSrc ? (
                            <Box sx={{ position: 'relative' }}>
                                <img
                                    alt={survey.title}
                                    className="w-full h-auto aspect-[2/1.4] md:aspect-[3/2] rounded-lg bg-black/10 dark:bg-white/10 object-cover"
                                    src={imageSrc}
                                    style={{ backgroundColor: 'transparent', width: '100%', borderRadius: 12, objectFit: 'cover', minHeight: 140, maxHeight: 180 }}
                                />
                                {isMy && (
                                    <Chip label="Моє" color="primary" size="small" sx={{ position: 'absolute', top: 12, right: 12, zIndex: 3, px: 1.5, fontWeight: 700, fontSize: 15 }} />
                                )}
                            </Box>
                        ) : (
                            <Box sx={{
                                width: '100%',
                                minHeight: 140,
                                maxHeight: 180,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: 'background.paper',
                                borderRadius: 2,
                                position: 'relative'
                            }}>
                                <Box sx={{ pointerEvents: 'none' }}>
                                    <LogoAvatar sx={{ width: 110, height: 110, fontSize: 48, borderWidth: 4, borderColor: 'primary.main', borderStyle: 'solid' }} />
                                </Box>
                                {isMy && (
                                    <Chip label="Моє" color="primary" size="small" sx={{ position: 'absolute', top: 12, right: 12, zIndex: 3, px: 1.5, fontWeight: 700, fontSize: 15 }} />
                                )}
                            </Box>
                        )}
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 300, color: 'text.secondary', letterSpacing: 1, wordBreak: 'break-word' }}>
                                {subtitle
                                    ? subtitle.length > 80
                                        ? subtitle.slice(0, 80) + '...'
                                        : subtitle
                                    : 'Опис опитування'}
                            </Typography>
                            <Typography variant="h6" sx={{ mt: 0.5, fontWeight: 600, mb: 0.2, wordBreak: 'break-word' }}>
                                {title
                                    ? title.length > 48
                                        ? title.slice(0, 48) + '...'
                                        : title
                                    : 'Назва опитування'}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            {expirationDate && (
                                <>
                                    <AccessTimeIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                                    <Typography variant="caption" color="text.secondary">
                                        до {formatExpirationDate(expirationDate)}
                                    </Typography>
                                </>
                            )}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                            <VisibilityIcon fontSize="small" color="action" sx={{ mr: 0.3 }} />
                            <Typography variant="body2" color="text.secondary">
                                {typeof survey.views === 'number' ? survey.views : 0}
                            </Typography>
                            <HowToVoteIcon fontSize="small" color="action" sx={{ ml: 0.5, mr: 0.3 }} />
                            <Typography variant="body2" color="text.secondary">
                                {typeof survey.votesCount === 'number' ? survey.votesCount : 0}
                            </Typography>
                            {isMy && typeof survey.messagesCount === 'number' && (
                                <Chip
                                    icon={<ChatBubbleOutlineIcon fontSize="small" />}
                                    label={survey.messagesCount}
                                    size="small"
                                    sx={{ ml: 0.5, minWidth: 26, bgcolor: 'transparent' }}
                                />
                            )}
                            <Chip
                                icon={open ? <LockOpenIcon /> : <LockIcon />}
                                label={open ? 'Відкритий' : 'Закритий'}
                                color={open ? "success" : "error"}
                                size="small"
                                sx={{ ml: 0.5, px: 1.1 }}
                                disabled={loadingToggle}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1, mt: 1 }}>
                            <IconButton
                                onClick={handleShare}
                                size="small"
                                sx={{ color: 'primary.main', '&:hover': { backgroundColor: 'rgba(0, 123, 255, 0.1)' } }}
                            >
                                <ShareIcon />
                            </IconButton>
                            {canEdit && (
                                <>
                                    <IconButton
                                        onClick={() => { setToggleAction('toggle'); setToggleDialogOpen(true); }}
                                        size="small"
                                        sx={{ color: open ? 'success.main' : 'error.main', '&:hover': { backgroundColor: open ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)' } }}
                                    >
                                        {open ? <LockOpenIcon /> : <LockIcon />}
                                    </IconButton>
                                    <IconButton
                                        onClick={() => setDeleteDialogOpen(true)}
                                        size="small"
                                        sx={{ color: 'error.main', '&:hover': { backgroundColor: 'rgba(220, 53, 69, 0.1)' } }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => setEditDialogOpen(true)}
                                        size="small"
                                        sx={{ color: 'primary.main', '&:hover': { backgroundColor: 'rgba(0, 123, 255, 0.1)' } }}
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
                                sx={{ whiteSpace: 'nowrap', minWidth: 0, fontWeight: 700, px: 2 }}
                            >
                                Дізнатися більше
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Видалити опитування</DialogTitle>
                <DialogContent>
                    <Typography>
                        Ви впевнені, що хочете видалити опитування? Цю дію неможливо скасувати.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>
                        Скасувати
                    </Button>
                    <Button
                        onClick={handleDelete}
                        color="error"
                        variant="contained"
                    >
                        Видалити
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Редагування опитування</DialogTitle>
                <DialogContent>
                    <Typography>
                        Після редагування опитування всі голоси, повідомлення та перегляди будуть скинуті. Ви впевнені, що хочете продовжити?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Скасувати</Button>
                    <Button color="warning" variant="contained" onClick={() => { setEditDialogOpen(false); navigate(`/edit-survey/${id}`); }}>Редагувати</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={toggleDialogOpen} onClose={() => setToggleDialogOpen(false)}>
                <DialogTitle>{open ? 'Закрити опитування?' : 'Відкрити опитування?'}</DialogTitle>
                <DialogContent>
                    {open ? (
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
        </>
    );
};

SurveyCardComponent.propTypes = {
    survey: PropTypes.object.isRequired,
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired,
    refetch: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};

// Memoize the component to prevent unnecessary re-renders
export const SurveyCard = memo(SurveyCardComponent);