import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

/**
 * A reusable pie chart component for survey visualizations
 * 
 * @param {Object} props
 * @param {Array} props.data - The data to display in the chart
 * @param {string} props.surveyType - The type of survey (SINGLE_CHOICE, MULTIPLE_CHOICE, RATING_SCALE, MATRIX, RANKING)
 * @param {Array} props.options - The survey options
 * @param {Array} props.votes - The survey votes data
 */
const PieChartComponent = ({ data, surveyType, options, votes }) => {
    // Process data based on survey type
    const processedData = () => {
        if (surveyType === 'RANKING') {
            // For ranking surveys, calculate how many times each option was ranked in top positions
            const topPositionCounts = {};
            // Initialize counts
            options.forEach(option => {
                topPositionCounts[option.id] = 0;
            });

            // Count top 3 positions (or fewer if there are fewer options)
            const topPositionsToCount = Math.min(3, options.length);

            if (votes) {
                votes.forEach(vote => {
                    vote.voteValues?.forEach(voteValue => {
                        if (typeof voteValue.rankPosition === 'number' &&
                            voteValue.rankPosition < topPositionsToCount) {
                            topPositionCounts[voteValue.surveyOptionId]++;
                        }
                    });
                });
            }

            // Convert to array format for the pie chart
            return options.map(option => ({
                id: option.id,
                name: option.name,
                votes: topPositionCounts[option.id] || 0
            }));
        } else if (surveyType === 'RATING_SCALE') {
            // For rating scale, show average ratings distribution
            const averageRatings = [];
            const ratingCounts = {};

            options.forEach(option => {
                ratingCounts[option.id] = { sum: 0, count: 0 };
            });

            if (votes) {
                votes.forEach(vote => {
                    vote.voteValues?.forEach(voteValue => {
                        if (voteValue.numericValue && voteValue.surveyOptionId) {
                            ratingCounts[voteValue.surveyOptionId].sum += voteValue.numericValue;
                            ratingCounts[voteValue.surveyOptionId].count++;
                        }
                    });
                });
            }

            options.forEach(option => {
                const count = ratingCounts[option.id].count;
                const avgRating = count > 0 ?
                    ratingCounts[option.id].sum / count : 0;

                averageRatings.push({
                    id: option.id,
                    name: option.name,
                    votes: Math.round(avgRating * 100) / 100 // Round to 2 decimal places
                });
            });

            return averageRatings;
        } else if (surveyType === 'MATRIX') {
            // For matrix surveys, show column distribution
            const columnCounts = {};
            const matrixColumns = data[0]?.matrixColumns || [];

            matrixColumns.forEach((col, index) => {
                columnCounts[index] = 0;
            });

            if (votes) {
                votes.forEach(vote => {
                    vote.voteValues?.forEach(voteValue => {
                        if (typeof voteValue.numericValue === 'number') {
                            columnCounts[voteValue.numericValue] =
                                (columnCounts[voteValue.numericValue] || 0) + 1;
                        }
                    });
                });
            }

            return matrixColumns.map((column, index) => ({
                id: index,
                name: column,
                votes: columnCounts[index] || 0
            }));
        } else {
            // Default for SINGLE_CHOICE and MULTIPLE_CHOICE
            return options;
        }
    };

    const chartData = processedData();

    // Get tooltip text based on survey type
    const getTooltipText = (value) => {
        switch (surveyType) {
            case 'RANKING':
                return `${value} разів у топ-3`;
            case 'RATING_SCALE':
                return `Середня оцінка: ${value}`;
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
                return 'Частота вибору на перші позиції (Pie Chart)';
            case 'RATING_SCALE':
                return 'Розподіл середніх оцінок (Pie Chart)';
            case 'MATRIX':
                return 'Розподіл відповідей по колонках (Pie Chart)';
            default:
                return 'Розподіл голосів (Pie Chart)';
        }
    };

    return (
        <>
            <svg width="0" height="0">
                <defs>
                    <linearGradient id="pieGradient1" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#43e97b" />
                        <stop offset="100%" stopColor="#38f9d7" />
                    </linearGradient>
                    <linearGradient id="pieGradient2" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#fa709a" />
                        <stop offset="100%" stopColor="#fee140" />
                    </linearGradient>
                    <linearGradient id="pieGradient3" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#21d4fd" />
                        <stop offset="100%" stopColor="#b721ff" />
                    </linearGradient>
                    <linearGradient id="pieGradient4" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#f7971e" />
                        <stop offset="100%" stopColor="#ffd200" />
                    </linearGradient>
                    <linearGradient id="pieGradient5" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#a18cd1" />
                        <stop offset="100%" stopColor="#fbc2eb" />
                    </linearGradient>
                </defs>
            </svg>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart id="pie-chart-export">
                    <Pie
                        data={chartData}
                        dataKey="votes"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label={({ name, percent, x, y, index }) => (
                            <text
                                x={x}
                                y={y}
                                fill="#222"
                                textAnchor="middle"
                                dominantBaseline="central"
                                fontSize="13"
                                fontWeight="bold"
                            >
                                {(name.length > 12 ? name.slice(0, 12) + '…' : name) + ': ' + (percent * 100).toFixed(0) + '%'}
                            </text>
                        )}
                        labelLine={{ stroke: '#bbb', strokeWidth: 1, length: 10, length2: 10 }}
                    >
                        {chartData.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={`url(#pieGradient${(idx % 5) + 1})`} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => getTooltipText(value)} />
                </PieChart>
            </ResponsiveContainer>
        </>
    );
};

export default PieChartComponent; 