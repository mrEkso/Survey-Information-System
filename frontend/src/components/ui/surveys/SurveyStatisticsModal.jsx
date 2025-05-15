import CloseIcon from "@mui/icons-material/Close";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Box, CircularProgress, IconButton, Modal, Tab, Tabs, Typography } from "@mui/material";
import Button from '@mui/material/Button';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import React from "react";
import ReactWordcloud from 'react-wordcloud';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0", "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];

function getVotesBySurvey(surveys) {
    return surveys.map(s => ({ name: s.title, Голоси: Array.isArray(s.options) ? s.options.reduce((sum, o) => sum + o.votes, 0) : 0 }));
}

function getSurveysByDate(surveys) {
    const byDate = {};
    surveys.forEach(s => {
        const date = new Date(s.createdAt).toLocaleDateString();
        byDate[date] = (byDate[date] || 0) + 1;
    });
    const entries = Object.entries(byDate).map(([date, count]) => ({ date, count }));
    if (entries.length > 0) {
        // Добавляем нулевую точку за день до минимальной даты
        const minDate = new Date(entries[0].date.split('.').reverse().join('-'));
        minDate.setDate(minDate.getDate() - 1);
        const zeroDate = minDate.toLocaleDateString();
        entries.unshift({ date: zeroDate, count: 0 });
    }
    return entries;
}

function getWordCloudData(surveys) {
    return surveys
        .map(s => ({ text: s.title, value: 0 + (Array.isArray(s.options) ? s.options.reduce((sum, o) => sum + o.votes, 0) : 1) }))
        .sort((a, b) => b.value - a.value);
}

function getOptionsWordCloudData(surveys) {
    const optionMap = {};
    surveys.forEach(s => {
        if (Array.isArray(s.options)) {
            s.options.forEach(o => {
                if (!optionMap[o.name]) optionMap[o.name] = 0;
                optionMap[o.name] += o.votes;
            });
        }
    });
    return Object.entries(optionMap)
        .map(([text, value]) => ({ text, value }))
        .sort((a, b) => b.value - a.value);
}

export default function SurveyStatisticsModal({ open, onClose, surveys, loading }) {
    const [tab, setTab] = React.useState(0);

    const handleExportExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Статистика опитувань');

        // Заголовки
        sheet.addRow(['Статистика по всіх опитуваннях']);
        sheet.mergeCells('A1:F1');
        sheet.getCell('A1').font = { bold: true, size: 16 };
        sheet.addRow([]);

        // Заголовки таблицы
        sheet.addRow(['Назва', 'Дата створення', 'Перегляди', 'Відкритий', 'Варіанти', 'Голоси']);
        sheet.getRow(3).font = { bold: true };

        // Данные
        surveys.forEach(s => {
            sheet.addRow([
                s.title,
                new Date(s.createdAt).toLocaleString(),
                s.views,
                s.open ? 'Так' : 'Ні',
                Array.isArray(s.options) ? s.options.map(o => o.name).join(', ') : '',
                Array.isArray(s.options) ? s.options.reduce((sum, o) => sum + o.votes, 0) : 0
            ]);
        });

        // Форматирование
        sheet.columns.forEach(col => col.width = 25);
        sheet.getRow(3).eachCell(cell => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE0E0E0' }
            };
        });

        // Сохраняем файл
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), 'survey_statistics.xlsx');
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: '98vw', sm: 700, md: 900 },
                maxHeight: '95vh',
                bgcolor: 'background.paper',
                borderRadius: 4,
                boxShadow: 24,
                p: 4,
                overflowY: 'auto',
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" fontWeight={700}>Статистика по опитуваннях</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {tab === 4 && (
                            <Button
                                variant="outlined"
                                startIcon={<FileDownloadOutlinedIcon />}
                                onClick={handleExportExcel}
                                disabled={loading || !surveys?.length}
                            >
                                Експорт в Excel
                            </Button>
                        )}
                        <IconButton onClick={onClose}><CloseIcon /></IconButton>
                    </Box>
                </Box>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" sx={{ mb: 3 }}>
                            <Tab label="Голоси по опитуваннях (Bar)" />
                            <Tab label="Голоси по варіантах (Pie)" />
                            <Tab label="Динаміка створення опитувань (Line)" />
                            <Tab label="WordCloud по назвах" />
                            <Tab label="Таблиця по опитуваннях" />
                        </Tabs>
                        {tab === 0 && (
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={getVotesBySurvey(surveys)}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" angle={-15} textAnchor="end" interval={0} height={80} />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip formatter={(value) => `${value} голосів`} />
                                    <Legend />
                                    <Bar dataKey="Голоси" fill="#0088FE">
                                        {surveys.map((entry, idx) => (
                                            <Cell key={`cell-bar-${idx}`} fill={COLORS[idx % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                        {tab === 1 && (
                            <Box>
                                {surveys.length === 0 && <Typography>Немає опитувань для відображення.</Typography>}
                                {surveys.map((survey, idx) => (
                                    <Box key={survey.id} sx={{ mb: 4 }}>
                                        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>{survey.title}</Typography>
                                        <ResponsiveContainer width="100%" height={220}>
                                            <PieChart>
                                                <Pie
                                                    data={Array.isArray(survey.options) ? survey.options.map(o => ({ name: o.name, value: o.votes })) : []}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={70}
                                                    label
                                                >
                                                    {(Array.isArray(survey.options) ? survey.options : []).map((entry, i) => (
                                                        <Cell key={`cell-pie-${i}`} fill={COLORS[i % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Box>
                                ))}
                            </Box>
                        )}
                        {tab === 2 && (
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'primary.main', textAlign: 'center' }}>
                                    Динаміка створення опитувань за датами
                                </Typography>
                                <ResponsiveContainer width="100%" height={350}>
                                    <LineChart data={getSurveysByDate(surveys)}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" tick={{ fontWeight: 'bold', fontSize: 14 }} tickFormatter={d => d} />
                                        <YAxis allowDecimals={false} tick={{ fontWeight: 'bold', fontSize: 14 }} />
                                        <Tooltip formatter={v => `${v} опитувань`} labelFormatter={l => `Дата: ${l}`} />
                                        <Legend formatter={() => 'Кількість опитувань'} />
                                        <Line type="monotone" dataKey="count" stroke="#A020F0" strokeWidth={3} name="Кількість опитувань" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>
                        )}
                        {tab === 3 && (
                            <>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'primary.main', textAlign: 'center' }}>
                                    WordCloud по назвах опитувань (за кількістю голосів)
                                </Typography>
                                <Box sx={{ width: '100%', height: 350 }}>
                                    <ReactWordcloud
                                        words={getWordCloudData(surveys)}
                                        options={{
                                            rotations: 0,
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
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 3, mb: 2, color: 'primary.main', textAlign: 'center' }}>
                                    WordCloud по варіантах відповідей (за кількістю голосів)
                                </Typography>
                                <Box sx={{ width: '100%', height: 350 }}>
                                    <ReactWordcloud
                                        words={getOptionsWordCloudData(surveys)}
                                        options={{
                                            rotations: 0,
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
                        )}
                        {tab === 4 && (
                            <Box sx={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
                                    <thead>
                                        <tr style={{ background: '#f5f5f5' }}>
                                            <th style={{ padding: 8, border: '1px solid #ddd' }}>Назва</th>
                                            <th style={{ padding: 8, border: '1px solid #ddd' }}>Дата створення</th>
                                            <th style={{ padding: 8, border: '1px solid #ddd' }}>Перегляди</th>
                                            <th style={{ padding: 8, border: '1px solid #ddd' }}>Відкритий</th>
                                            <th style={{ padding: 8, border: '1px solid #ddd' }}>Варіанти</th>
                                            <th style={{ padding: 8, border: '1px solid #ddd' }}>Голоси</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {surveys.map(s => (
                                            <tr key={s.id}>
                                                <td style={{ padding: 8, border: '1px solid #ddd' }}>{s.title}</td>
                                                <td style={{ padding: 8, border: '1px solid #ddd' }}>{new Date(s.createdAt).toLocaleString()}</td>
                                                <td style={{ padding: 8, border: '1px solid #ddd' }}>{s.views}</td>
                                                <td style={{ padding: 8, border: '1px solid #ddd' }}>{s.open ? 'Так' : 'Ні'}</td>
                                                <td style={{ padding: 8, border: '1px solid #ddd' }}>{Array.isArray(s.options) ? s.options.map(o => o.name).join(', ') : ''}</td>
                                                <td style={{ padding: 8, border: '1px solid #ddd' }}>{Array.isArray(s.options) ? s.options.reduce((sum, o) => sum + o.votes, 0) : 0}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Box>
                        )}
                    </>
                )}
            </Box>
        </Modal>
    );
}
