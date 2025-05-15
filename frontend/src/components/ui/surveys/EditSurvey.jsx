import useBottomSnackbar from "@components/ui/snackbars/BottomSnackbar.jsx";
import MultilineTextField from "@components/ui/typographies/MultilineTextField.jsx";
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { Box, Button, CircularProgress, Container, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useGetSurveyImageQuery, useGetSurveyQuery, useUpdateSurveyMutation, useUploadSurveyImageMutation } from "src/services/store/api/surveyApi.jsx";
import { selectUser } from "src/services/store/slices/userSlice.jsx";

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    marginTop: theme.spacing(4),
    backgroundColor: theme.palette.white.main,
    color: theme.palette.text.primary,
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
    '& .MuiInputBase-multiline': {
        height: 'auto !important',
    }
}));

const OptionContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));

const MAX_IMAGE_SIZE = 1024 * 1024; // 1MB

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
        options: [],
        expirationDate: null,
        surveyType: 'SINGLE_CHOICE',
        minRating: 1,
        maxRating: 5,
        matrixColumns: ['', '']
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadSurveyImage] = useUploadSurveyImageMutation();
    let fileName = null;
    if (surveyData?.survey?.imageUrl) {
        const parts = surveyData.survey.imageUrl.split('/');
        fileName = parts[parts.length - 1];
    }
    const { data: fileData, isSuccess } = useGetSurveyImageQuery(fileName, { skip: !fileName });

    useEffect(() => {
        if (surveyData?.survey) {
            setFormData({
                title: surveyData.survey.title,
                subtitle: surveyData.survey.subtitle,
                options: surveyData.survey.options?.map(opt => ({ ...opt })) || ['', ''],
                expirationDate: surveyData.survey.expirationDate || null,
                surveyType: surveyData.survey.surveyType || 'SINGLE_CHOICE',
                minRating: surveyData.survey.minRating || 1,
                maxRating: surveyData.survey.maxRating || 5,
                matrixColumns: surveyData.survey.matrixColumns || ['', '']
            });
            if (isSuccess && fileData) {
                setImagePreview(fileData);
            } else {
                setImagePreview(null);
            }
        }
    }, [surveyData, isSuccess, fileData]);

    const handleBack = () => {
        navigate('/admin-panel');
    };

    const handleOptionChange = (index, value) => {
        setFormData(prev => ({
            ...prev,
            options: prev.options.map((option, i) => i === index ? { ...option, name: value } : option)
        }));
    };

    const handleMatrixColumnChange = (index, value) => {
        setFormData(prev => ({
            ...prev,
            matrixColumns: prev.matrixColumns.map((col, i) => i === index ? value : col)
        }));
    };

    const addOption = () => {
        setFormData(prev => ({
            ...prev,
            options: [...prev.options, { name: '' }]
        }));
    };

    const addMatrixColumn = () => {
        setFormData(prev => ({
            ...prev,
            matrixColumns: [...prev.matrixColumns, '']
        }));
    };

    const removeOption = (index) => {
        if (formData.options.length > 2) {
            setFormData(prev => ({
                ...prev,
                options: prev.options.filter((_, i) => i !== index)
            }));
        } else {
            snackbar('Мінімальна кількість опцій - 2', "error");
        }
    };

    const removeMatrixColumn = (index) => {
        if (formData.matrixColumns.length > 2) {
            setFormData(prev => ({
                ...prev,
                matrixColumns: prev.matrixColumns.filter((_, i) => i !== index)
            }));
        } else {
            snackbar('Необхідно мати мінімум 2 колонки', "error");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(null);
        if (file) {
            if (file.size > MAX_IMAGE_SIZE) {
                snackbar('Зображення занадто велике (макс. 1MB)', 'error');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
            setImageFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check for empty options
        if (formData.options.some(option => !option.name?.trim())) {
            snackbar('Не всі опції заповнені', "error");
            return;
        }

        // For matrix survey type, check matrix columns
        if (formData.surveyType === 'MATRIX' && formData.matrixColumns.some(col => !col.trim())) {
            snackbar('Колонки матриці не можуть бути порожніми', "error");
            return;
        }

        // Convert expirationDate to ISO string if present
        let expirationDateIso = null;
        if (formData.expirationDate) {
            const date = new Date(formData.expirationDate);
            expirationDateIso = date.toISOString();
        }

        try {
            const { error, data } = await updateSurvey({
                id,
                data: {
                    id,
                    title: formData.title,
                    subtitle: formData.subtitle,
                    open: surveyData.survey.open,
                    options: formData.options.map(opt => ({ id: opt.id, name: opt.name })),
                    expirationDate: expirationDateIso,
                    imageUrl: !imageFile ? surveyData.survey.imageUrl : undefined,
                    surveyType: formData.surveyType,
                    minRating: formData.surveyType === 'RATING_SCALE' ? formData.minRating : null,
                    maxRating: formData.surveyType === 'RATING_SCALE' ? formData.maxRating : null,
                    matrixColumns: formData.surveyType === 'MATRIX' ? formData.matrixColumns.filter(col => col.trim()) : null
                }
            });
            if (error) {
                snackbar(error.data.message || 'Не вдалося оновити опитування', "error");
            } else {
                if (imageFile) {
                    try {
                        await uploadSurveyImage({ id, image: imageFile });
                    } catch (imgErr) {
                        snackbar('Не вдалося завантажити зображення', 'error');
                    }
                }
                snackbar('Опитування оновлено успішно', "success");
                navigate(`/surveys/${id}`);
            }
        } catch (error) {
            snackbar('Сталася непередбачена помилка', "error");
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

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(formData.options);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setFormData(prev => ({
            ...prev,
            options: items
        }));
    };

    // Render survey options based on survey type
    const renderSurveyOptions = () => {
        switch (formData.surveyType) {
            case 'SINGLE_CHOICE':
            case 'MULTIPLE_CHOICE':
                return (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, color: 'text.secondary' }}>
                            Варіанти відповіді
                        </Typography>
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="droppable-options">
                                {(provided) => (
                                    <Box {...provided.droppableProps} ref={provided.innerRef}>
                                        {formData.options.map((option, index) => (
                                            <Draggable key={option.id || `option-${index}`} draggableId={option.id || `option-${index}`} index={index}>
                                                {(provided) => (
                                                    <OptionContainer
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                    >
                                                        <Box display="flex" alignItems="center" width="100%">
                                                            <Box {...provided.dragHandleProps} sx={{ mr: 1, color: 'text.secondary' }}>
                                                                <DragIndicatorIcon />
                                                            </Box>
                                                            <StyledTextField
                                                                fullWidth
                                                                variant="outlined"
                                                                placeholder={`Варіант ${index + 1}`}
                                                                value={option.name || ''}
                                                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                                            />
                                                            <IconButton
                                                                onClick={() => removeOption(index)}
                                                                size="small"
                                                                color="error"
                                                                sx={{ minWidth: 40, ml: 1 }}
                                                                disabled={formData.options.length <= 2}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Box>
                                                    </OptionContainer>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </Box>
                                )}
                            </Droppable>
                        </DragDropContext>
                        <Button
                            startIcon={<AddIcon />}
                            onClick={addOption}
                            variant="outlined"
                            color="primary"
                            sx={{ mt: 2 }}
                        >
                            Додати варіант
                        </Button>
                    </Box>
                );

            case 'RATING_SCALE':
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, color: 'text.secondary' }}>
                            Налаштування рейтингової шкали
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <StyledTextField
                                label="Мінімальне значення"
                                type="number"
                                name="minRating"
                                value={formData.minRating}
                                onChange={handleChange}
                                InputProps={{ inputProps: { min: 1, max: 10 } }}
                                sx={{ width: '50%' }}
                                helperText="Мінімум: 1"
                            />
                            <StyledTextField
                                label="Максимальне значення"
                                type="number"
                                name="maxRating"
                                value={formData.maxRating}
                                onChange={handleChange}
                                InputProps={{ inputProps: { min: 2, max: 10 } }}
                                sx={{ width: '50%' }}
                                helperText="Максимум: 10"
                            />
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Приклад шкали:
                            </Typography>
                            <Rating max={Math.min(Number(formData.maxRating) || 1, 10)} />
                        </Box>

                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, color: 'text.secondary' }}>
                            Елементи для оцінки
                        </Typography>
                        {formData.options.map((option, index) => (
                            <OptionContainer key={option.id || index}>
                                <StyledTextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder={`Елемент ${index + 1} для оцінки`}
                                    value={option.name || ''}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                />
                                <IconButton
                                    onClick={() => removeOption(index)}
                                    size="small"
                                    color="error"
                                    sx={{ minWidth: 40 }}
                                    disabled={formData.options.length <= 2}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </OptionContainer>
                        ))}
                        <Button
                            startIcon={<AddIcon />}
                            onClick={addOption}
                            variant="outlined"
                            color="primary"
                            sx={{ mt: 2 }}
                        >
                            Додати елемент
                        </Button>
                    </Box>
                );

            case 'MATRIX':
                return (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, color: 'text.secondary' }}>
                            Колонки матриці (заголовки)
                        </Typography>
                        {formData.matrixColumns.map((column, index) => (
                            <OptionContainer key={index}>
                                <StyledTextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder={`Заголовок колонки ${index + 1}`}
                                    value={column}
                                    onChange={(e) => handleMatrixColumnChange(index, e.target.value)}
                                />
                                <IconButton
                                    onClick={() => removeMatrixColumn(index)}
                                    size="small"
                                    color="error"
                                    sx={{ minWidth: 40 }}
                                    disabled={formData.matrixColumns.length <= 2}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </OptionContainer>
                        ))}
                        <Button
                            startIcon={<AddIcon />}
                            onClick={addMatrixColumn}
                            variant="outlined"
                            color="primary"
                            sx={{ mt: 2, mb: 3 }}
                        >
                            Додати колонку
                        </Button>

                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, color: 'text.secondary', mt: 3 }}>
                            Рядки матриці (питання)
                        </Typography>
                        {formData.options.map((option, index) => (
                            <OptionContainer key={option.id || index}>
                                <StyledTextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder={`Питання ${index + 1}`}
                                    value={option.name || ''}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                />
                                <IconButton
                                    onClick={() => removeOption(index)}
                                    size="small"
                                    color="error"
                                    sx={{ minWidth: 40 }}
                                    disabled={formData.options.length <= 2}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </OptionContainer>
                        ))}
                        <Button
                            startIcon={<AddIcon />}
                            onClick={addOption}
                            variant="outlined"
                            color="primary"
                            sx={{ mt: 2 }}
                        >
                            Додати питання
                        </Button>
                    </Box>
                );

            case 'RANKING':
                return (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, color: 'text.secondary' }}>
                            Елементи для ранжування
                        </Typography>
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="droppable-ranking">
                                {(provided) => (
                                    <Box {...provided.droppableProps} ref={provided.innerRef}>
                                        {formData.options.map((option, index) => (
                                            <Draggable key={option.id || `ranking-${index}`} draggableId={option.id || `ranking-${index}`} index={index}>
                                                {(provided) => (
                                                    <OptionContainer
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                    >
                                                        <Box display="flex" alignItems="center" width="100%">
                                                            <Box {...provided.dragHandleProps} sx={{ mr: 1, color: 'text.secondary' }}>
                                                                <DragIndicatorIcon />
                                                            </Box>
                                                            <StyledTextField
                                                                fullWidth
                                                                variant="outlined"
                                                                placeholder={`Елемент ${index + 1}`}
                                                                value={option.name || ''}
                                                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                                            />
                                                            <IconButton
                                                                onClick={() => removeOption(index)}
                                                                size="small"
                                                                color="error"
                                                                sx={{ minWidth: 40, ml: 1 }}
                                                                disabled={formData.options.length <= 2}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Box>
                                                    </OptionContainer>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </Box>
                                )}
                            </Droppable>
                        </DragDropContext>
                        <Button
                            startIcon={<AddIcon />}
                            onClick={addOption}
                            variant="outlined"
                            color="primary"
                            sx={{ mt: 2 }}
                        >
                            Додати елемент
                        </Button>
                    </Box>
                );

            default:
                return null;
        }
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
                    Опитування не знайдено
                </Typography>
            </Container>
        );
    }

    if (currentUser?.id !== surveyData.survey.user.id) {
        return (
            <Container maxWidth="md">
                <Typography variant="h5" color="error" align="center" sx={{ mt: 4 }}>
                    У вас немає доступу до цього опитування
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
                    Редагувати опитування
                </Typography>
            </Box>

            <StyledPaper>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, color: 'text.secondary' }}>
                            Зображення опитування
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px dashed',
                                borderColor: 'primary.main',
                                borderRadius: 2,
                                p: 2,
                                mb: 2,
                                background: '#fafbfc',
                                cursor: 'pointer',
                                transition: 'border-color 0.2s',
                                '&:hover': { borderColor: 'primary.dark' },
                                minHeight: 180,
                                position: 'relative',
                            }}
                            onClick={() => document.getElementById('edit-image-input').click()}
                        >
                            <input
                                id="edit-image-input"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    style={{
                                        maxWidth: 220,
                                        maxHeight: 180,
                                        borderRadius: 12,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                        objectFit: 'cover',
                                    }}
                                />
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'primary.main' }}>
                                    <PhotoCamera sx={{ fontSize: 48, mb: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        Натисніть або перетягніть фото сюди
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, color: 'text.secondary' }}>
                            Назва опитування
                        </Typography>
                        <MultilineTextField
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Назва опитування"
                            required
                            minRows={1}
                            maxRows={2}
                            inputProps={{ maxLength: 100 }}
                            helperText={`${formData.title.length}/100 символів`}
                        />
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, color: 'text.secondary' }}>
                            Опис опитування
                        </Typography>
                        <MultilineTextField
                            name="subtitle"
                            value={formData.subtitle}
                            onChange={handleChange}
                            placeholder="Опис опитування"
                            required
                            minRows={1}
                            maxRows={7}
                            inputProps={{
                                maxLength: 500,
                                style: { overflow: 'auto', height: 'auto' }
                            }}
                            helperText={`${formData.subtitle.length}/500 символів`}
                        />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, color: 'text.secondary' }}>
                            Тип опитування
                        </Typography>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="survey-type-label">Тип опитування</InputLabel>
                            <Select
                                labelId="survey-type-label"
                                name="surveyType"
                                value={formData.surveyType}
                                onChange={handleChange}
                                label="Тип опитування"
                            >
                                <MenuItem value="SINGLE_CHOICE">Вибір одного варіанту</MenuItem>
                                <MenuItem value="MULTIPLE_CHOICE">Вибір декількох варіантів</MenuItem>
                                <MenuItem value="RATING_SCALE">Шкала оцінювання</MenuItem>
                                <MenuItem value="MATRIX">Матриця (таблиця)</MenuItem>
                                <MenuItem value="RANKING">Ранжування (перетягування)</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    {renderSurveyOptions()}

                    <Box sx={{ mb: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, color: 'text.secondary', mb: 0, mt: 2 }}>
                                Дата закриття
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button variant="outlined" size="small" onClick={() => {
                                    const now = new Date();
                                    now.setHours(now.getHours() + 1);
                                    setFormData(prev => ({ ...prev, expirationDate: now.toISOString().slice(0, 16) }));
                                }}>
                                    Поставити зараз
                                </Button>
                                <Button variant="outlined" size="small" onClick={() => setFormData(prev => ({ ...prev, expirationDate: null }))}>
                                    Очистити дату
                                </Button>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TextField
                                name="expirationDate"
                                type="datetime-local"
                                value={formData.expirationDate || ''}
                                onChange={handleChange}
                                sx={{ width: '100%' }}
                                InputLabelProps={{ shrink: true }}
                                helperText="Залиште порожнім, якщо опитування не має обмеження за часом"
                            />
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={handleBack}
                            sx={{ minWidth: 120 }}
                        >
                            Скасувати
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isUpdating}
                            sx={{ minWidth: 120 }}
                        >
                            {isUpdating ? 'Зберігаю...' : 'Зберегти'}
                        </Button>
                    </Box>
                </form>
            </StyledPaper>
        </Container>
    );
} 