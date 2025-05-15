import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

/**
 * Component for displaying ranking position distribution in a table and chart
 * 
 * @param {Object} props
 * @param {Object} props.survey - The survey data
 * @param {Array} props.surveyData - The survey votes data
 */
const RankingPositionTable = ({ survey, surveyData }) => {
    return (
        <Box sx={{ mt: 4, mb: 4 }}>
            <Typography
                variant="subtitle1"
                sx={{
                    fontWeight: 600,
                    color: 'primary.main',
                    textAlign: 'center',
                    mb: 2,
                    mt: 4
                }}
            >
                Середні позиції в рейтингу (Average Ranking Position)
            </Typography>
            <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={(() => {
                            // Calculate average ranking positions
                            const rankingData = [];

                            if (surveyData?.votes && survey.options) {
                                const positionSums = {};
                                const positionCounts = {};

                                // Initialize with all options
                                survey.options.forEach(option => {
                                    positionSums[option.id] = 0;
                                    positionCounts[option.id] = 0;
                                });

                                // Sum up positions
                                surveyData.votes.forEach(vote => {
                                    vote.voteValues?.forEach(voteValue => {
                                        if (typeof voteValue.rankPosition === 'number' && voteValue.surveyOptionId) {
                                            positionSums[voteValue.surveyOptionId] += voteValue.rankPosition + 1; // +1 because positions are 0-indexed
                                            positionCounts[voteValue.surveyOptionId]++;
                                        }
                                    });
                                });

                                // Calculate averages and prepare data
                                survey.options.forEach(option => {
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
                        })()}
                        layout="vertical"
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, survey.options.length]} />
                        <YAxis dataKey="name" type="category" width={150} />
                        <Tooltip formatter={(value, name) => [value, name]} />
                        <Legend />
                        <Bar dataKey="Середня позиція" fill="#8884d8">
                            {survey.options.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={`url(#barGradient${(index % 5) + 1})`} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Box>

            <Box sx={{ mt: 4 }}>
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontWeight: 600,
                        color: 'primary.main',
                        textAlign: 'center',
                        mb: 2
                    }}
                >
                    Розподіл позицій (Position Distribution)
                </Typography>
                <TableContainer component={Paper} sx={{ overflow: 'auto' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Варіант</TableCell>
                                {Array.from({ length: survey.options.length }, (_, i) => (
                                    <TableCell key={i} align="center">
                                        Позиція {i + 1}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {survey.options.map(option => {
                                // Calculate position distribution for this option
                                const positionDistribution = Array(survey.options.length).fill(0);

                                if (surveyData?.votes) {
                                    surveyData.votes.forEach(vote => {
                                        const voteValue = vote.voteValues?.find(v => v.surveyOptionId === option.id);
                                        if (voteValue && typeof voteValue.rankPosition === 'number') {
                                            positionDistribution[voteValue.rankPosition]++;
                                        }
                                    });
                                }

                                const maxCount = Math.max(...positionDistribution, 1);

                                return (
                                    <TableRow key={option.id}>
                                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                                            {option.name}
                                        </TableCell>
                                        {positionDistribution.map((count, posIndex) => {
                                            const intensity = count / maxCount;
                                            const totalVotes = surveyData?.votes?.length || 1;
                                            const percentage = (count / totalVotes) * 100;

                                            return (
                                                <TableCell
                                                    key={posIndex}
                                                    align="center"
                                                    sx={{
                                                        bgcolor: `rgba(25, 118, 210, ${intensity * 0.8})`,
                                                        color: intensity > 0.5 ? 'white' : 'black',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    {count}
                                                    <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                                                        {percentage.toFixed(1)}%
                                                    </Typography>
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default RankingPositionTable; 