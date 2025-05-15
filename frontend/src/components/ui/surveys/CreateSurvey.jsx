import useBottomSnackbar from "@components/ui/snackbars/BottomSnackbar.jsx";
import MultilineTextField from "@components/ui/typographies/MultilineTextField.jsx";
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import useResponsive from "@hooks/useResponsive";
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { Box, Button, Container, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateSurveyMutation, useUploadSurveyImageMutation } from "src/services/store/api/surveyApi.jsx";

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
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
        marginTop: theme.spacing(2),
    }
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
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: theme.spacing(1),
    }
}));

const MAX_IMAGE_SIZE = 1024 * 1024; // 1MB

export default function CreateSurvey() {
    const navigate = useNavigate();
    const [createSurvey, { isLoading }] = useCreateSurveyMutation();
    const [uploadSurveyImage] = useUploadSurveyImageMutation();
    const snackbar = useBottomSnackbar();
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        options: ['', ''], // Initial two options
        expirationDate: null,
        surveyType: 'SINGLE_CHOICE',
        minRating: 1,
        maxRating: 5,
        matrixColumns: ['', ''] // Initial two matrix columns
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const { isMobile, isSmallMobile } = useResponsive();

    const handleBack = () => {
        navigate('/admin-panel');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check for empty options
        if (formData.options.some(option => !option.trim())) {
            snackbar('Опції не можуть бути порожніми', "error");
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
            const surveyData = {
                title: formData.title,
                subtitle: formData.subtitle,
                options: formData.options
                    .filter(option => option.trim())
                    .map(option => ({ name: option })),
                expirationDate: expirationDateIso,
                surveyType: formData.surveyType,
                minRating: formData.surveyType === 'RATING_SCALE' ? formData.minRating : null,
                maxRating: formData.surveyType === 'RATING_SCALE' ? formData.maxRating : null,
                matrixColumns: formData.surveyType === 'MATRIX' ? formData.matrixColumns.filter(col => col.trim()) : null
            };
            // 1. Create survey
            const data = await createSurvey(surveyData).unwrap();
            // 2. If there is an image — upload it
            if (imageFile && data?.data.id) {
                try {
                    await uploadSurveyImage({ id: data.data.id, image: imageFile }).unwrap();
                } catch (imgErr) {
                    snackbar('Не вдалося завантажити зображення', 'error');
                }
            }

            snackbar('Опитування успішно створено', "success");
            navigate('/admin-panel');
        } catch (error) {
            snackbar(error?.data?.message || 'Не вдалося створити опитування', "error");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleOptionChange = (index, value) => {
        setFormData(prev => ({
            ...prev,
            options: prev.options.map((option, i) => i === index ? value : option)
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
            options: [...prev.options, '']
        }));
    };

    const addMatrixColumn = () => {
        setFormData(prev => ({
            ...prev,
            matrixColumns: [...prev.matrixColumns, '']
        }));
    };

    const removeOption = (index) => {
        if (formData.options.length > 2) { // Minimum 2 options
            setFormData(prev => ({
                ...prev,
                options: prev.options.filter((_, i) => i !== index)
            }));
        } else {
            snackbar('Необхідно мати мінімум 2 опції', "error");
        }
    };

    const removeMatrixColumn = (index) => {
        if (formData.matrixColumns.length > 2) { // Minimum 2 columns
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
        if (file) {
            if (file.size > MAX_IMAGE_SIZE) {
                snackbar('Зображення занадто велике (макс. 1MB)', 'error');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setImageFile(file);
            };
            reader.readAsDataURL(file);
        }
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

    // Main form content based on survey type
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
                                            <Draggable key={index} draggableId={`option-${index}`} index={index}>
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
                                                                value={option}
                                                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                                            />
                                                            <IconButton
                                                                onClick={() => removeOption(index)}
                                                                size="small"
                                                                color="error"
                                                                sx={{ minWidth: 40, ml: 1 }}
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
                                InputProps={{ inputProps: { min: 1, max: 9 } }}
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
                            <OptionContainer key={index}>
                                <StyledTextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder={`Елемент ${index + 1} для оцінки`}
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                />
                                <IconButton
                                    onClick={() => removeOption(index)}
                                    size="small"
                                    color="error"
                                    sx={{ minWidth: 40 }}
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
                            <OptionContainer key={index}>
                                <StyledTextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder={`Питання ${index + 1}`}
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                />
                                <IconButton
                                    onClick={() => removeOption(index)}
                                    size="small"
                                    color="error"
                                    sx={{ minWidth: 40 }}
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
                                            <Draggable key={index} draggableId={`ranking-${index}`} index={index}>
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
                                                                value={option}
                                                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                                            />
                                                            <IconButton
                                                                onClick={() => removeOption(index)}
                                                                size="small"
                                                                color="error"
                                                                sx={{ minWidth: 40, ml: 1 }}
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

    return (
        <Container maxWidth="md" sx={{ px: { xs: 2, md: 3 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <IconButton onClick={handleBack} edge="start" aria-label="back">
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    Створити нове опитування
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
                                padding: '20px',
                                borderRadius: '8px',
                                border: '2px dashed rgba(0, 91, 187, 0.3)',
                                backgroundColor: 'rgba(0, 91, 187, 0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    backgroundColor: 'rgba(0, 91, 187, 0.08)',
                                },
                                position: 'relative',
                                minHeight: '220px',
                                width: '100%',
                            }}
                            onClick={() => document.getElementById('create-image-input').click()}
                        >
                            <input
                                id="create-image-input"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Survey Preview"
                                    style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                                />
                            ) : (
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'text.secondary'
                                }}>
                                    <PhotoCamera sx={{ fontSize: 48, mb: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        Натисніть або перетягніть фото сюди
                                    </Typography>
                                </Box>
                            )}
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                                Максимальний розмір 1MB
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, color: 'text.secondary' }}>
                            Основна інформація
                        </Typography>
                        <StyledTextField
                            fullWidth
                            variant="outlined"
                            label="Назва опитування"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            margin="normal"
                        />
                        <MultilineTextField
                            fullWidth
                            variant="outlined"
                            label="Опис опитування"
                            name="subtitle"
                            value={formData.subtitle}
                            onChange={handleChange}
                            required
                            margin="normal"
                            minRows={3}
                        />
                        <Box>
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
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, color: 'text.secondary', mb: 0 }}>
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
                                color="primary"
                                disabled={isLoading}
                                sx={{ minWidth: 120 }}
                            >
                                {isLoading ? 'Надсилаю...' : 'Створити'}
                            </Button>
                        </Box>
                    </Box>
                </form>
            </StyledPaper>
        </Container>
    );
} 