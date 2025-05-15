import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Box, Typography } from '@mui/material';
import ReactWordcloud from 'react-wordcloud';

/**
 * A reusable word cloud component for survey visualizations
 * 
 * @param {Object} props
 * @param {Array} props.data - The data to display in the chart
 * @param {string} props.surveyType - The type of survey (SINGLE_CHOICE, MULTIPLE_CHOICE, RATING_SCALE, MATRIX, RANKING)
 * @param {Array} props.options - The survey options
 * @param {Array} props.votes - The survey votes data
 */
const WordCloudComponent = ({ data, surveyType, options, votes }) => {
    // Process data based on survey type
    const processedData = () => {
        if (surveyType === 'RANKING') {
            // For ranking surveys, calculate weighted scores based on positions
            // Lower positions (higher rank) get higher scores
            const weightedScores = {};
            const totalOptions = options.length;

            // Initialize scores
            options.forEach(option => {
                weightedScores[option.id] = 0;
            });

            if (votes) {
                votes.forEach(vote => {
                    vote.voteValues?.forEach(voteValue => {
                        if (typeof voteValue.rankPosition === 'number' && voteValue.surveyOptionId) {
                            // Invert scores: position 0 (first) gets highest score
                            const score = totalOptions - voteValue.rankPosition;
                            weightedScores[voteValue.surveyOptionId] += score;
                        }
                    });
                });
            }

            return options.map(option => ({
                text: option.name,
                value: weightedScores[option.id] || 0
            }));
        } else if (surveyType === 'RATING_SCALE') {
            // For rating scale, use average ratings as weights
            const ratingScores = {};

            // Initialize scores
            options.forEach(option => {
                ratingScores[option.id] = 0;
            });

            if (votes) {
                const ratingSums = {};
                const ratingCounts = {};

                options.forEach(option => {
                    ratingSums[option.id] = 0;
                    ratingCounts[option.id] = 0;
                });

                votes.forEach(vote => {
                    vote.voteValues?.forEach(voteValue => {
                        if (voteValue.numericValue && voteValue.surveyOptionId) {
                            ratingSums[voteValue.surveyOptionId] += voteValue.numericValue;
                            ratingCounts[voteValue.surveyOptionId]++;
                        }
                    });
                });

                options.forEach(option => {
                    const count = ratingCounts[option.id];
                    if (count > 0) {
                        ratingScores[option.id] = ratingSums[option.id] / count;
                    }
                });
            }

            return options.map(option => ({
                text: option.name,
                value: ratingScores[option.id] * 10 || 0 // Multiply by 10 to make values more significant
            }));
        } else if (surveyType === 'MATRIX') {
            // For matrix surveys, use column selection frequency
            const matrixColumns = data.matrixColumns || [];
            const columnCounts = {};

            matrixColumns.forEach((col, idx) => {
                columnCounts[idx] = 0;
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

            return matrixColumns.map((column, idx) => ({
                text: column,
                value: columnCounts[idx] || 0
            }));
        } else {
            // Default for SINGLE_CHOICE and MULTIPLE_CHOICE
            return options.map(option => ({
                text: option.name,
                value: option.votes || 0
            }));
        }
    };

    const wordCloudData = processedData();

    // Get chart description based on survey type
    const getChartDescription = () => {
        switch (surveyType) {
            case 'RANKING':
                return 'Розмір слова відображає зважену популярність варіанту (вищі позиції мають більшу вагу).';
            case 'RATING_SCALE':
                return 'Розмір слова відображає середню оцінку варіанту.';
            case 'MATRIX':
                return 'Розмір слова відображає частоту вибору колонки.';
            default:
                return 'Розмір слова відображає кількість голосів за варіант.';
        }
    };

    return (
        <>
            <Box sx={{ width: '100%', mb: 1, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 13, mb: 1 }}>
                    {getChartDescription()}
                </Typography>
            </Box>
            <Box id="wordcloud-export" sx={{ height: '100%', bgcolor: 'background.paper', borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', boxShadow: 1, p: 2 }}>
                <ReactWordcloud
                    words={wordCloudData}
                    options={{
                        rotations: 1,
                        rotationAngles: [0, 0],
                        fontSizes: [24, 64],
                    }}
                />
            </Box>
            <Box sx={{ mt: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <WarningAmberIcon sx={{ color: 'warning.main', mr: 1, fontSize: 20 }} />
                <Typography sx={{ color: 'warning.main', fontWeight: 500, fontSize: 14 }}>
                    Деякі варіанти можуть не відображатися у Word Cloud, особливо якщо вони мають дуже довгий текст.
                </Typography>
            </Box>
        </>
    );
};

export default WordCloudComponent; 