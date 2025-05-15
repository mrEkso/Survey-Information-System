import { useMediaQuery, useTheme } from '@mui/material';

/**
 * Хук для перевірки розмірів екрану
 * Повертає об'єкт з набором булевих значень для різних розмірів
 */
export const useResponsive = () => {
    const theme = useTheme();

    // Для кращої читабельності і менших формул
    const breakpoints = theme.breakpoints.values;

    return {
        // Базові перевірки загальних випадків
        isMobile: useMediaQuery(theme.breakpoints.down('sm')),  // < 600px
        isTablet: useMediaQuery(theme.breakpoints.between('sm', 'md')),  // 600-960px
        isDesktop: useMediaQuery(theme.breakpoints.up('md')),  // >= 960px
        isLargeDesktop: useMediaQuery(theme.breakpoints.up('lg')),  // >= 1280px

        // Додаткові перевірки для особливих випадків
        isSmallMobile: useMediaQuery(`(max-width:${480}px)`),  // < 480px
        isMediumMobile: useMediaQuery(`(min-width:${481}px) and (max-width:${767}px)`),  // 481-767px
        isSmallTablet: useMediaQuery(`(min-width:${768}px) and (max-width:${breakpoints.md - 1}px)`),  // 768-959px

        // Спеціальні функції для точних запитів
        down: (breakpoint) => useMediaQuery(theme.breakpoints.down(breakpoint)),
        up: (breakpoint) => useMediaQuery(theme.breakpoints.up(breakpoint)),
        between: (start, end) => useMediaQuery(theme.breakpoints.between(start, end)),

        // Орієнтація екрану
        isPortrait: useMediaQuery('(orientation: portrait)'),
        isLandscape: useMediaQuery('(orientation: landscape)'),
    };
};

// Константи для тих, хто воліє імпортувати напряму
export const SCREEN = {
    XS: 0,
    SM: 600,
    MD: 960,
    LG: 1280,
    XL: 1920,
    MOBILE_MAX: 767,
    SMALL_MOBILE_MAX: 480,
};

export default useResponsive; 