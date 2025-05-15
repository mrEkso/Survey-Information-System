import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

/**
 * A reusable line chart component for survey visualizations
 * 
 * @param {Object} props
 * @param {Array} props.data - The survey data
 * @param {string} props.surveyType - The type of survey (SINGLE_CHOICE, MULTIPLE_CHOICE, RATING_SCALE, MATRIX, RANKING)
 * @param {Array} props.options - The survey options
 * @param {Array} props.votes - The survey votes data
 * @param {Function} props.formatDateTick - Function to format date ticks on X axis
 */
const LineChartComponent = ({ data, surveyType, options, votes, formatDateTick }) => {
    // Process data based on survey type
    const processedData = () => {
        if (surveyType === 'RANKING') {
            // For ranking surveys, calculate average position by date
            if (!votes || !options) return [];

            const optionNamesById = Object.fromEntries(options.map(o => [o.id, o.name]));
            const optionIds = options.map(o => o.id);
            const dateMap = {};

            // Group votes by date
            votes.forEach(vote => {
                const date = new Date(vote.createdAt).toISOString().split('T')[0];

                if (!dateMap[date]) {
                    dateMap[date] = {
                        positionSums: {},
                        positionCounts: {}
                    };

                    // Initialize for all options
                    optionIds.forEach(id => {
                        dateMap[date].positionSums[id] = 0;
                        dateMap[date].positionCounts[id] = 0;
                    });
                }

                // Add position data
                vote.voteValues?.forEach(vv => {
                    if (typeof vv.rankPosition === 'number' && vv.surveyOptionId) {
                        dateMap[date].positionSums[vv.surveyOptionId] += vv.rankPosition + 1;
                        dateMap[date].positionCounts[vv.surveyOptionId]++;
                    }
                });
            });

            // Calculate average positions for each date
            const sortedDates = Object.keys(dateMap).sort();
            const chartEntries = sortedDates.map(date => {
                const entry = { date };

                optionIds.forEach(id => {
                    const name = optionNamesById[id];
                    const counts = dateMap[date].positionCounts[id];
                    const sums = dateMap[date].positionSums[id];
                    entry[name] = counts > 0 ? parseFloat((sums / counts).toFixed(2)) : null;
                });

                return entry;
            });
            // Add zero point at the beginning
            if (chartEntries.length > 0) {
                // Find the true minimal date
                const minDateStr = sortedDates.reduce((min, curr) => (curr < min ? curr : min), sortedDates[0]);
                const zeroDate = new Date(minDateStr);
                zeroDate.setDate(zeroDate.getDate() - 1);
                const zeroEntry = { date: zeroDate.toISOString().split('T')[0] };
                optionIds.forEach(id => {
                    const name = optionNamesById[id];
                    zeroEntry[name] = 0;
                });
                chartEntries.unshift(zeroEntry);
            }
            return chartEntries;
        } else if (surveyType === 'RATING_SCALE') {
            // For rating scale, show average rating over time
            if (!votes || !options) return [];

            const optionNamesById = Object.fromEntries(options.map(o => [o.id, o.name]));
            const optionIds = options.map(o => o.id);
            const dateMap = {};

            // Group votes by date
            votes.forEach(vote => {
                const date = new Date(vote.createdAt).toISOString().split('T')[0];

                if (!dateMap[date]) {
                    dateMap[date] = {
                        ratingSums: {},
                        ratingCounts: {}
                    };

                    // Initialize for all options
                    optionIds.forEach(id => {
                        dateMap[date].ratingSums[id] = 0;
                        dateMap[date].ratingCounts[id] = 0;
                    });
                }

                // Add rating data
                vote.voteValues?.forEach(vv => {
                    if (vv.numericValue && vv.surveyOptionId) {
                        dateMap[date].ratingSums[vv.surveyOptionId] += vv.numericValue;
                        dateMap[date].ratingCounts[vv.surveyOptionId]++;
                    }
                });
            });

            // Calculate average ratings for each date
            const sortedDates = Object.keys(dateMap).sort();
            return sortedDates.map(date => {
                const entry = { date };

                optionIds.forEach(id => {
                    const name = optionNamesById[id];
                    const counts = dateMap[date].ratingCounts[id];
                    const sums = dateMap[date].ratingSums[id];
                    entry[name] = counts > 0 ? parseFloat((sums / counts).toFixed(2)) : null;
                });

                return entry;
            });
        } else if (surveyType === 'MATRIX') {
            // For matrix surveys, show column selection over time
            if (!votes || !data.matrixColumns) return [];

            const matrixColumns = data.matrixColumns;
            const dateMap = {};

            // Group votes by date
            votes.forEach(vote => {
                const date = new Date(vote.createdAt).toISOString().split('T')[0];

                if (!dateMap[date]) {
                    dateMap[date] = {};

                    // Initialize for all columns
                    matrixColumns.forEach((col, idx) => {
                        dateMap[date][col] = 0;
                    });
                }

                // Add column data
                vote.voteValues?.forEach(vv => {
                    if (typeof vv.numericValue === 'number') {
                        const columnName = matrixColumns[vv.numericValue];
                        if (columnName) {
                            dateMap[date][columnName]++;
                        }
                    }
                });
            });

            // Format data for chart
            const sortedDates = Object.keys(dateMap).sort();
            return sortedDates.map(date => {
                return {
                    date,
                    ...dateMap[date]
                };
            });
        } else {
            // Default for SINGLE_CHOICE and MULTIPLE_CHOICE - use votesByDate
            return data;
        }
    };

    const chartData = processedData();

    // Get Y axis domain based on survey type
    const getYAxisDomain = () => {
        if (surveyType === 'RANKING') {
            return [0, options.length + 1];
        }
        return undefined; // Let recharts calculate automatically
    };

    // Get tooltip formatter based on survey type
    const getTooltipFormatter = (value, name) => {
        if (!value) return 'Немає даних';

        switch (surveyType) {
            case 'RANKING':
                return `Позиція ${value}`;
            case 'RATING_SCALE':
                return `Оцінка ${value}`;
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
                return 'Динаміка рейтингових позицій (Line Chart)';
            case 'RATING_SCALE':
                return 'Динаміка оцінок (Line Chart)';
            case 'MATRIX':
                return 'Динаміка відповідей (Line Chart)';
            default:
                return 'Динаміка голосування (Line Chart)';
        }
    };

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
                <LineChart
                    id="line-chart-export"
                    data={chartData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        tick={{ fontWeight: 'bold', fontSize: 15 }}
                        tickFormatter={formatDateTick}
                    />
                    <YAxis
                        domain={getYAxisDomain()}
                        allowDecimals={surveyType !== 'RANKING'}
                        tick={{ fontWeight: 'bold', fontSize: 15 }}
                    />
                    <Tooltip formatter={(value, name) => getTooltipFormatter(value, name)} />
                    <Legend />
                    {options.map((option, idx) => (
                        <Line
                            key={option.name}
                            type="monotone"
                            dataKey={option.name}
                            stroke={`url(#barGradient${(idx % 5) + 1})`}
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            connectNulls={true}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </>
    );
};

export default LineChartComponent; 