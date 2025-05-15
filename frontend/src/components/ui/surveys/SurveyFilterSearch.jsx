import { CenteredContainer } from "@components/ui/containers/CenteredContainer.jsx";
import { GoldPagination } from "@components/ui/paginations/GoldPagination.jsx";
import { SurveysGrid } from "@components/ui/surveys/SurveysGrid.jsx";
import { SecondaryTypography } from "@components/ui/typographies/SecondaryTypography.jsx";
import useResponsive from "@hooks/useResponsive";
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from '@mui/icons-material/Sort';
import { Box, CircularProgress, InputAdornment, TextField } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { green, red } from '@mui/material/colors';
import { useState } from 'react';

/**
 * Universal component for searching, filtering and displaying surveys
 * @param {Object} props - Component props
 * @param {Function} props.useQueryHook - Query hook for surveys (useGetSurveysQuery or useGetUserSurveysQuery)
 * @param {string} props.emptyStateMessage - Message when there are no surveys
 * @param {Function} props.refetch - Function to force data update (optional)
 * @param {Object} props.additionalQueryParams - Additional query parameters (optional)
 */
export const SurveyFilterSearch = ({
    useQueryHook,
    emptyStateMessage = "На даний момент немає доступних опитувань. Завітайте пізніше!",
    refetch,
    additionalQueryParams = {}
}) => {
    const { isMobile, isSmallMobile } = useResponsive();
    const [page, setPage] = useState(0);
    const [searchText, setSearchText] = useState("");
    const [open, setOpen] = useState('all'); // 'all' | true | false
    const [sort, setSort] = useState('default');

    // Building query parameters
    const queryParams = {
        page,
        searchText: searchText || undefined,
        open: open === 'all' ? undefined : open,
        sort: sort === 'default' ? undefined : sort,
        ...additionalQueryParams
    };

    // Using the passed query hook
    const { data: surveys, isLoading } = useQueryHook(queryParams);

    const handleStatusChange = (event) => {
        const value = event.target.value;
        setOpen(value === 'all' ? 'all' : value === 'true');
        setPage(0);
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
        setPage(0);
    };

    const handleSortChange = (event) => {
        setSort(event.target.value);
    };

    const handlePaginationChange = (event, value) => {
        setPage(value - 1);
    };

    // Generating content based on state and query results
    const renderContent = () => {
        if (isLoading) {
            return <SecondaryTypography sx={{ py: 4, minHeight: 200, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </SecondaryTypography>;
        }

        if (!surveys || !surveys.content || surveys.content.length === 0) {
            return <SecondaryTypography sx={{ py: 4, minHeight: 200 }}>
                {searchText
                    ? "За вашим запитом нічого не знайдено. Спробуйте змінити критерії пошуку."
                    : emptyStateMessage}
            </SecondaryTypography>;
        }

        return (
            <>
                <SurveysGrid surveys={surveys} refetch={refetch} />
                <GoldPagination
                    count={surveys.totalPages}
                    page={page + 1}
                    onChange={handlePaginationChange}
                    sx={{ mt: 3, mb: 5 }}
                />
            </>
        );
    };

    return (
        <>
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                justifyContent: 'center',
                gap: { xs: 1.5, sm: 2 },
                mb: 3,
                mt: 0,
                width: '100%',
                alignSelf: 'flex-start',
            }}>
                <TextField
                    value={searchText}
                    onChange={handleSearchChange}
                    placeholder="Пошук опитувань..."
                    variant="outlined"
                    size={isSmallMobile ? "medium" : "small"}
                    sx={{
                        width: '100%',
                        maxWidth: { xs: '100%', sm: 400 },
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                        },
                        height: 40,
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        style: { height: 40 },
                    }}
                />
                <FormControl
                    size={isSmallMobile ? "medium" : "small"}
                    sx={{
                        minWidth: { xs: '100%', sm: 150 },
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                        },
                        height: 40,
                    }}
                >
                    <InputLabel id="survey-status-label">Статус</InputLabel>
                    <Select
                        labelId="survey-status-label"
                        id="survey-status-select"
                        value={open === 'all' ? 'all' : open ? 'true' : 'false'}
                        label="Статус"
                        onChange={handleStatusChange}
                        sx={{
                            fontWeight: 500,
                            height: 40,
                        }}
                    >
                        <MenuItem value="all" sx={{
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                        }}>
                            <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                                Всі
                            </Box>
                        </MenuItem>
                        <MenuItem value="true" sx={{
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                        }}>
                            <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                                <LockOpenIcon sx={{ color: green[600], mr: 1, verticalAlign: 'middle' }} />
                                Відкриті
                            </Box>
                        </MenuItem>
                        <MenuItem value="false" sx={{
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                        }}>
                            <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                                <LockIcon sx={{ color: red[500], mr: 1, verticalAlign: 'middle' }} />
                                Закриті
                            </Box>
                        </MenuItem>
                    </Select>
                </FormControl>
                <FormControl
                    size={isSmallMobile ? "medium" : "small"}
                    sx={{
                        minWidth: { xs: '100%', sm: 370 },
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                        },
                        height: 40,
                    }}
                >
                    <InputLabel id="survey-sort-label"><SortIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Сортування</InputLabel>
                    <Select
                        labelId="survey-sort-label"
                        id="survey-sort-select"
                        value={sort}
                        label="Сортування"
                        onChange={handleSortChange}
                        sx={{
                            fontWeight: 500,
                            height: 40,
                        }}
                    >
                        <MenuItem value="default" sx={{ height: 40 }}>За замовчуванням</MenuItem>
                        <MenuItem value="views_desc" sx={{ height: 40 }}>Перегляди: від більшого до меншого</MenuItem>
                        <MenuItem value="views_asc" sx={{ height: 40 }}>Перегляди: від меншого до більшого</MenuItem>
                        <MenuItem value="created_desc" sx={{ height: 40 }}>Дата створення: від нових до старих</MenuItem>
                        <MenuItem value="created_asc" sx={{ height: 40 }}>Дата створення: від старих до нових</MenuItem>
                        <MenuItem value="title_asc" sx={{ height: 40 }}>Назва: А-Я</MenuItem>
                        <MenuItem value="title_desc" sx={{ height: 40 }}>Назва: Я-А</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <CenteredContainer>
                {renderContent()}
            </CenteredContainer>
        </>
    );
}; 