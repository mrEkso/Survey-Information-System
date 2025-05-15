import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Базова тема
let theme = createTheme({
    palette: {
        primary: {
            main: '#0057b8',
            dark: '#003c80',
            light: '#4286cc',
        },
        secondary: {
            main: '#ffd700',
            dark: '#e6c200',
            light: '#ffde33',
        },
        gold: {
            main: '#ffd700',
        },
        military: {
            main: '#4b5320',
            dark: '#3a4119',
            light: '#6d753c',
        },
        white: {
            main: '#ffffff',
        },
        black: {
            main: '#000000',
        },
        text: {
            primary: '#000000',
            secondary: '#4b5320',
        },
        background: {
            default: '#fff', // White
        },
    },
    // Налаштування для адаптивності компонентів
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    },
                },
                // Налаштування для мобільної версії
                sizeMedium: {
                    '@media (max-width:480px)': {
                        fontSize: '0.875rem',
                        padding: '8px 16px',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    '@media (max-width:480px)': {
                        borderRadius: '8px',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    '@media (max-width:480px)': {
                        borderRadius: '8px',
                    },
                    '&.MuiAppBar-root': {
                        borderRadius: 0,
                    },
                    '&.heroSection': {
                        borderRadius: 0, // Завжди прямі кути для головної секції
                    },
                    // Прямі кути для елементів, що займають всю ширину екрану
                    '&.fullWidth, &.fullScreen': {
                        borderRadius: 0,
                    },
                },
            },
        },
        MuiContainer: {
            styleOverrides: {
                root: {
                    '@media (max-width:600px)': {
                        padding: '0 16px',
                    },
                },
            },
        },
    },
    typography: {
        fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            '@media (max-width:600px)': {
                fontSize: '2.5rem',
            },
        },
        h2: {
            '@media (max-width:600px)': {
                fontSize: '2rem',
            },
        },
        h3: {
            '@media (max-width:600px)': {
                fontSize: '1.75rem',
            },
        },
        button: {
            textTransform: 'none',
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
        },
    },
});

// Застосовуємо автоматичне масштабування шрифтів для різних розмірів екранів
theme = responsiveFontSizes(theme);

export { theme };

