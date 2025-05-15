import Footer from '@components/Footer.jsx';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import React, { Suspense } from 'react';
import { useInView } from 'react-intersection-observer';
import { Outlet } from "react-router-dom";
const MainFeatures = React.lazy(() => import('@components/ui/MainFeatures.jsx'));
const BenefitsSection = React.lazy(() => import('@components/ui/sections/BenefitsSection.jsx'));
const Surveys = React.lazy(() => import('@components/ui/surveys/Surveys.jsx'));

export default function Content({ onSurveyPresenceChange }) {
    const { ref: refMain, inView: inViewMain } = useInView({ triggerOnce: true, threshold: 0.1 });
    const { ref: refSurveys, inView: inViewSurveys } = useInView({ triggerOnce: true, threshold: 0.1 });
    const { ref: refBenefits, inView: inViewBenefits } = useInView({ triggerOnce: true, threshold: 0.1 });

    // Кастомный fallback с анимацией подтягивания
    const AnimatedFallback = (
        <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ minHeight: 300, width: '100%' }}
        >
            <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: '#888' }}>
                Загрузка...
            </div>
        </motion.div>
    );

    return (
        <>
            <main>
                <div ref={refMain} style={{ minHeight: 300 }}>
                    {inViewMain && (
                        <Suspense fallback={AnimatedFallback}>
                            <MainFeatures />
                        </Suspense>
                    )}
                </div>
                <div ref={refSurveys} style={{ minHeight: 300 }}>
                    {inViewSurveys && (
                        <Suspense fallback={AnimatedFallback}>
                            <Surveys onSurveyPresenceChange={onSurveyPresenceChange} />
                        </Suspense>
                    )}
                </div>
                <div ref={refBenefits} style={{ minHeight: 300 }}>
                    {inViewBenefits && (
                        <Suspense fallback={AnimatedFallback}>
                            <BenefitsSection />
                        </Suspense>
                    )}
                </div>
                <Box sx={{ width: '100vw', position: 'relative', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw', mt: 0 }}>
                    <Footer mt={0} />
                </Box>
                <Outlet />
            </main>
        </>
    );
}