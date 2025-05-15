import { CenteredContainer } from "@components/ui/containers/CenteredContainer";
import useResponsive from "@hooks/useResponsive";
import surveysImage from "@images/hero.png";
import { Box, Button, Paper, Typography } from "@mui/material";
import { motion } from 'framer-motion';
import React from "react";
import { theme } from "src/theme.jsx";

const MainFeatures = () => {
    const { isMobile, isSmallMobile } = useResponsive();

    return (
        <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
        >
            <Paper
                className="heroSection"
                sx={{
                    position: 'relative',
                    backgroundImage: `url(${surveysImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: isMobile ? 'center bottom' : 'center',
                    height: { xs: '110vh', sm: '120vh', md: '110vh' },
                    minHeight: { xs: '100vh', md: '800px' },
                    overflow: 'hidden',
                    color: 'white.main',
                    borderRadius: 0,
                    boxShadow: '0 -12px 32px -12px rgba(0,0,0,0.10)',
                    pt: 0,
                    mt: '-64px',
                    width: '100%',
                    maxWidth: '100vw',
                    boxSizing: 'border-box',
                }}
            >
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 1,
                    background: 'rgba(75,83,32,0.6)',
                }} />
                <CenteredContainer sx={{ height: '100%' }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        width: '100%',
                        height: '100%',
                        marginTop: { xs: "15%", sm: "12%", md: "10%" },
                        position: 'relative',
                        zIndex: 2,
                        px: { xs: 2, sm: 3, md: 4 },
                        pb: { xs: 8, sm: 0 },
                    }}>
                        <Box sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            maxWidth: { xs: '100%', md: '75%' },
                        }}>
                            <Typography
                                variant="h1"
                                gutterBottom
                                sx={{
                                    fontWeight: 'bold',
                                    color: 'white.main',
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                                    position: 'relative',
                                    display: 'inline-block',
                                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                                    lineHeight: { xs: 1.2, md: 1.1 },
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: '-10px',
                                        left: 0,
                                        width: { xs: '80px', sm: '100px' },
                                        height: '4px',
                                        background: theme.palette.secondary.main
                                    }
                                }}
                            >
                                <Box component="span" sx={{ color: theme.palette.secondary.main }}>
                                    ЗСУ&nbsp;
                                </Box>
                                Логістика
                            </Typography>

                            <Typography
                                variant="h4"
                                color="white.main"
                                sx={{
                                    mb: { xs: 2, md: 4 },
                                    mt: { xs: 2, md: 3 },
                                    maxWidth: { xs: '100%', md: '80%' },
                                    fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
                                    fontWeight: 500,
                                }}
                            >
                                Долучайтесь до покращення логістики ЗСУ!
                            </Typography>

                            <Typography
                                variant="h5"
                                color="white.main"
                                sx={{
                                    mb: { xs: 3, md: 4 },
                                    maxWidth: { xs: '100%', md: '80%' },
                                    fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                                    lineHeight: 1.5,
                                }}
                            >
                                Голосуйте в опитуваннях, залишайте свої пропозиції та допомагайте робити забезпечення армії ефективнішим.
                            </Typography>

                            <Button
                                variant="contained"
                                color="secondary"
                                size={isSmallMobile ? "medium" : "large"}
                                sx={{
                                    width: { xs: '100%', sm: '60%', md: '40%' },
                                    fontWeight: 'bold',
                                    py: { xs: 1.2, md: 1.5 },
                                    fontSize: { xs: '1rem', md: '1.1rem' },
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-3px)',
                                        boxShadow: '0 6px 15px rgba(0,0,0,0.25)',
                                    }
                                }}
                                onClick={() => {
                                    const el = document.getElementById('surveys');
                                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                Перейти до опитувань
                            </Button>
                        </Box>
                    </Box>
                </CenteredContainer>
            </Paper>
        </motion.div>
    );
}

export default MainFeatures;