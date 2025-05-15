import { Box, Typography } from '@mui/material';
import BarChartComponent from './BarChartComponent';
import LineChartComponent from './LineChartComponent';
import PieChartComponent from './PieChartComponent';
import WordCloudComponent from './WordCloudComponent';

/**
 * A container component for charts with title and consistent styling
 * 
 * @param {Object} props
 * @param {string} props.chartType - The type of chart to display (pie, bar, line, wordcloud)
 * @param {string} props.title - The title of the chart
 * @param {Object} props.survey - The survey data
 * @param {Array} props.votes - The survey votes data
 * @param {Function} props.formatDateTick - Function to format date ticks on X axis (for line charts)
 * @param {Array} props.votesByDate - Processed votes by date (for line charts)
 */
const ChartContainer = ({
    chartType,
    title,
    survey,
    votes,
    formatDateTick,
    votesByDate
}) => {
    // Get chart title based on survey type and chart type
    const getChartTitle = () => {
        if (title) return title;

        const baseTitle = (() => {
            switch (chartType) {
                case 'pie':
                    switch (survey.surveyType) {
                        case 'RANKING':
                            return 'Частота вибору на перші позиції';
                        case 'RATING_SCALE':
                            return 'Розподіл середніх оцінок';
                        case 'MATRIX':
                            return 'Розподіл відповідей по колонках';
                        default:
                            return 'Розподіл голосів';
                    }
                case 'bar':
                    switch (survey.surveyType) {
                        case 'RANKING':
                            return 'Середні позиції в рейтингу';
                        case 'RATING_SCALE':
                            return 'Середні оцінки';
                        case 'MATRIX':
                            return 'Розподіл відповідей по колонках';
                        default:
                            return 'Голоси по варіантах';
                    }
                case 'line':
                    switch (survey.surveyType) {
                        case 'RANKING':
                            return 'Динаміка рейтингових позицій';
                        case 'RATING_SCALE':
                            return 'Динаміка оцінок';
                        case 'MATRIX':
                            return 'Динаміка відповідей';
                        default:
                            return 'Динаміка голосування';
                    }
                case 'wordcloud':
                    switch (survey.surveyType) {
                        case 'RANKING':
                            return 'Популярність за рейтингом';
                        case 'RATING_SCALE':
                            return 'Популярність за оцінками';
                        case 'MATRIX':
                            return 'Популярність колонок';
                        default:
                            return 'Популярність варіантів';
                    }
                default:
                    return 'Результати опитування';
            }
        })();

        return `${baseTitle} (${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart)`;
    };

    // Render the appropriate chart component based on chartType
    const renderChart = () => {
        switch (chartType) {
            case 'pie':
                return (
                    <PieChartComponent
                        data={survey}
                        surveyType={survey.surveyType}
                        options={survey.options}
                        votes={votes}
                    />
                );
            case 'bar':
                return (
                    <BarChartComponent
                        data={survey}
                        surveyType={survey.surveyType}
                        options={survey.options}
                        votes={votes}
                        maxRating={survey.maxRating}
                    />
                );
            case 'line':
                return (
                    <LineChartComponent
                        data={votesByDate || []}
                        surveyType={survey.surveyType}
                        options={survey.options}
                        votes={votes}
                        formatDateTick={formatDateTick}
                    />
                );
            case 'wordcloud':
                return (
                    <WordCloudComponent
                        data={survey}
                        surveyType={survey.surveyType}
                        options={survey.options}
                        votes={votes}
                    />
                );
            default:
                return <Typography>Невідомий тип діаграми</Typography>;
        }
    };

    return (
        <Box sx={{ flex: 1, minWidth: 260, mt: chartType === 'bar' ? { xs: 4, md: 0 } : 0 }}>
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
                {getChartTitle()}
            </Typography>
            <Box sx={{ height: chartType === 'line' ? { xs: 300, md: 400 } : 260 }}>
                {renderChart()}
            </Box>
        </Box>
    );
};

export default ChartContainer; 