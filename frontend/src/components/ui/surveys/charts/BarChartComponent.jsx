import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

/**
 * A reusable bar chart component for survey visualizations
 * 
 * @param {Object} props
 * @param {Array} props.data - The data to display in the chart
 * @param {string} props.surveyType - The type of survey (SINGLE_CHOICE, MULTIPLE_CHOICE, RATING_SCALE, MATRIX, RANKING)
 * @param {Array} props.options - The survey options
 * @param {Array} props.votes - The survey votes data
 * @param {number} props.maxRating - The maximum rating (for RATING_SCALE)
 */
const BarChartComponent = ({ data, surveyType, options, votes, maxRating }) => {
    // Process data based on survey type
    const processedData = () => {
        if (surveyType === 'RANKING') {
            // Calculate average ranking positions
            const rankingData = [];

            if (votes && options) {
                const positionSums = {};
                const positionCounts = {};

                // Initialize with all options
                options.forEach(option => {
                    positionSums[option.id] = 0;
                    positionCounts[option.id] = 0;
                });

                // Sum up positions
                votes.forEach(vote => {
                    vote.voteValues?.forEach(voteValue => {
                        if (typeof voteValue.rankPosition === 'number' && voteValue.surveyOptionId) {
                            positionSums[voteValue.surveyOptionId] += voteValue.rankPosition + 1; // +1 because positions are 0-indexed
                            positionCounts[voteValue.surveyOptionId]++;
                        }
                    });
                });

                // Calculate averages and prepare data
                options.forEach(option => {
                    const avgPosition = positionCounts[option.id] > 0
                        ? positionSums[option.id] / positionCounts[option.id]
                        : 0;

                    rankingData.push({
                        name: option.name,
                        'Середня позиція': parseFloat(avgPosition.toFixed(2)),
                        votes: positionCounts[option.id]
                    });
                });

                // Sort by average position (ascending)
                rankingData.sort((a, b) => a['Середня позиція'] - b['Середня позиція']);
            }

            return rankingData;
        } else if (surveyType === 'RATING_SCALE') {
            // For rating scale, show average ratings
            const averageRatings = [];

            if (votes && options) {
                options.forEach(option => {
                    let totalRating = 0;
                    let count = 0;

                    votes.forEach(vote => {
                        const voteValue = vote.voteValues?.find(v => v.surveyOptionId === option.id);
                        if (voteValue && voteValue.numericValue) {
                            totalRating += voteValue.numericValue;
                            count++;
                        }
                    });

                    const avgRating = count > 0 ? totalRating / count : 0;
                    averageRatings.push({
                        name: option.name,
                        'Середня оцінка': parseFloat(avgRating.toFixed(2)),
                        'Максимальна оцінка': maxRating,
                        count
                    });
                });
            }

            return averageRatings;
        } else if (surveyType === 'MATRIX') {
            // For matrix surveys, show column distribution
            const columnData = [];
            const matrixColumns = data.matrixColumns || [];

            if (votes) {
                // Calculate totals for each column
                const columnTotals = Array(matrixColumns?.length || 0).fill(0);

                votes.forEach(vote => {
                    vote.voteValues?.forEach(voteValue => {
                        if (typeof voteValue.numericValue === 'number') {
                            columnTotals[voteValue.numericValue]++;
                        }
                    });
                });

                matrixColumns.forEach((column, index) => {
                    columnData.push({
                        name: column,
                        'Кількість відповідей': columnTotals[index] || 0
                    });
                });
            }

            return columnData;
        } else {
            // Default for SINGLE_CHOICE and MULTIPLE_CHOICE
            return options.map(option => ({
                ...option,
                'Голоси': option.votes
            }));
        }
    };

    const chartData = processedData();

    // Get data key based on survey type
    const getDataKey = () => {
        switch (surveyType) {
            case 'RANKING':
                return 'Середня позиція';
            case 'RATING_SCALE':
                return 'Середня оцінка';
            case 'MATRIX':
                return 'Кількість відповідей';
            default:
                return 'Голоси';
        }
    };

    // Get domain for X axis based on survey type
    const getXAxisDomain = () => {
        switch (surveyType) {
            case 'RANKING':
                return [0, options.length];
            case 'RATING_SCALE':
                return [0, maxRating];
            default:
                return undefined; // Let recharts calculate automatically
        }
    };

    // Get tooltip formatter based on survey type
    const getTooltipFormatter = (value) => {
        switch (surveyType) {
            case 'RANKING':
                return `${value}`;
            case 'RATING_SCALE':
                return `${value}`;
            case 'MATRIX':
                return `${value} відповідей`;
            default:
                return `${value} голосів`;
        }
    };

    // Get chart title based on survey type
    const getChartTitle = () => {
        switch (surveyType) {
            case 'RANKING':
                return 'Середні позиції в рейтингу (Bar Chart)';
            case 'RATING_SCALE':
                return 'Середні оцінки (Bar Chart)';
            case 'MATRIX':
                return 'Розподіл відповідей по колонках (Bar Chart)';
            default:
                return 'Голоси по варіантах (Bar Chart)';
        }
    };

    // Determine if we should use vertical layout
    const useVerticalLayout = surveyType === 'RANKING' ||
        (surveyType !== 'RATING_SCALE' &&
            surveyType !== 'MATRIX');

    return (
        <>
            <svg width="0" height="0">
                <defs>
                    <linearGradient id="barGradient1" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#1976d2" />
                        <stop offset="100%" stopColor="#00bcd4" />
                    </linearGradient>
                    <linearGradient id="barGradient2" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#ffb347" />
                        <stop offset="100%" stopColor="#ff7043" />
                    </linearGradient>
                    <linearGradient id="barGradient3" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#a18cd1" />
                        <stop offset="100%" stopColor="#fbc2eb" />
                    </linearGradient>
                    <linearGradient id="barGradient4" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#f7971e" />
                        <stop offset="100%" stopColor="#ffd200" />
                    </linearGradient>
                    <linearGradient id="barGradient5" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#21d4fd" />
                        <stop offset="100%" stopColor="#b721ff" />
                    </linearGradient>
                </defs>
            </svg>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    id="bar-chart-export"
                    data={chartData}
                    layout={useVerticalLayout ? "vertical" : "horizontal"}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    {useVerticalLayout ? (
                        <>
                            <XAxis
                                type="number"
                                domain={getXAxisDomain()}
                                allowDecimals={surveyType === 'RANKING' || surveyType === 'RATING_SCALE'}
                                tick={{ fontWeight: 'bold', fontSize: 13 }}
                            />
                            <YAxis
                                dataKey="name"
                                type="category"
                                tick={{ fontWeight: 'bold', fontSize: 13 }}
                                width={100}
                            />
                        </>
                    ) : (
                        <>
                            <XAxis
                                dataKey="name"
                                tick={{ fontWeight: 'bold', fontSize: 13 }}
                            />
                            <YAxis
                                domain={getXAxisDomain()}
                                allowDecimals={surveyType === 'RATING_SCALE'}
                                tick={{ fontWeight: 'bold', fontSize: 13 }}
                            />
                        </>
                    )}
                    <Tooltip formatter={(value) => getTooltipFormatter(value)} />
                    <Legend />
                    <Bar dataKey={getDataKey()} radius={[8, 8, 8, 8]}>
                        {chartData.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={`url(#barGradient${(idx % 5) + 1})`} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </>
    );
};

export default BarChartComponent; 