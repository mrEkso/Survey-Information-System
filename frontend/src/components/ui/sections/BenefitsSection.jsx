import ShieldIcon from '@mui/icons-material/Shield';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Box, Typography, useTheme } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

// Компонент для створення частинок навколо іконки
const Particles = ({ color, isActive }) => {
    const particles = [];
    const particleCount = 12;

    for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * 360;
        const delay = i * 0.04;

        particles.push(
            <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={isActive ? {
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    x: [0, Math.cos(angle * (Math.PI / 180)) * 80],
                    y: [0, Math.sin(angle * (Math.PI / 180)) * 80]
                } : { scale: 0, opacity: 0 }}
                transition={{
                    duration: 4,
                    delay: delay,
                    ease: [0.2, 0.8, 0.4, 1]
                }}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: color,
                    boxShadow: `0 0 8px ${color}`,
                    zIndex: 1
                }}
            />
        );
    }

    return particles;
};

// Круговий хвильовий ефект
const RippleEffect = ({ isActive }) => {
    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ scale: 0.2, opacity: 1 }}
                    animate={{ scale: 5, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        border: '2px solid rgba(255, 215, 0, 0.8)',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 0
                    }}
                />
            )}
        </AnimatePresence>
    );
};

// Портал для рендерингу анімації поверх усього
const AnimationPortal = ({ children, isOpen }) => {
    const portalRef = useRef(null);

    useEffect(() => {
        const portalContainer = document.createElement('div');
        portalContainer.style.position = 'fixed';
        portalContainer.style.top = '0';
        portalContainer.style.left = '0';
        portalContainer.style.width = '100%';
        portalContainer.style.height = '100%';
        portalContainer.style.pointerEvents = 'none';
        portalContainer.style.zIndex = '9999';

        document.body.appendChild(portalContainer);
        portalRef.current = portalContainer;

        return () => {
            if (portalRef.current) {
                document.body.removeChild(portalRef.current);
            }
        };
    }, []);

    if (!portalRef.current || !isOpen) return null;

    return ReactDOM.createPortal(children, portalRef.current);
};

// Основна анімація іконки
const IconAnimation = ({ Icon, iconColor }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const iconRef = useRef(null);

    const handleClick = () => {
        if (!isAnimating && iconRef.current) {
            const rect = iconRef.current.getBoundingClientRect();
            setPosition({
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            });
            setIsAnimating(true);

            setTimeout(() => {
                setIsAnimating(false);
            }, 2000);
        }
    };

    return (
        <>
            <motion.div
                ref={iconRef}
                className="icon-container"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClick}
                style={{
                    cursor: 'pointer',
                    position: 'relative',
                    display: 'inline-block'
                }}
            >
                <motion.div
                    animate={isAnimating ? { scale: [1, 0.9, 1], rotate: [0, -5, 0] } : {}}
                    transition={{ duration: 0.4 }}
                >
                    <Icon
                        sx={{
                            fontSize: '2.5rem',
                            color: iconColor,
                            marginBottom: '1.5rem',
                            filter: isAnimating ? 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.9))' : 'drop-shadow(0 0 5px rgba(255, 215, 0, 0.5))',
                            transition: 'filter 0.3s ease'
                        }}
                    />
                </motion.div>

                <div style={{
                    position: 'absolute',
                    top: '-15px',
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none'
                }}>
                    <Particles color="#FFD700" isActive={isAnimating} />
                </div>
            </motion.div>

            {/* Портал для глобальної анімації */}
            <AnimationPortal isOpen={isAnimating}>
                <motion.div
                    initial={{
                        x: position.x,
                        y: position.y,
                        scale: 1,
                        opacity: 0,
                        rotateY: 0
                    }}
                    animate={[
                        // Стартова позиція
                        {
                            x: position.x,
                            y: position.y,
                            scale: 1,
                            opacity: 1,
                            rotateY: 0,
                            filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))'
                        },
                        // Збільшення та обертання
                        {
                            scale: 3,
                            opacity: 1,
                            rotateY: 360,
                            filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 1))'
                        },
                        // Фінальне зникнення
                        {
                            x: position.x,
                            y: position.y,
                            scale: 1,
                            opacity: 0,
                            filter: 'drop-shadow(0 0 0px rgba(255, 215, 0, 0.6))'
                        }
                    ]}
                    transition={{
                        duration: 1.5,
                        times: [0, 0.6, 1],
                        ease: "easeInOut"
                    }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        pointerEvents: 'none',
                        transformStyle: 'preserve-3d',
                        perspective: '800px'
                    }}
                >
                    <Icon
                        sx={{
                            fontSize: '2.5rem',
                            color: iconColor
                        }}
                    />
                </motion.div>
            </AnimationPortal>
        </>
    );
};

const BenefitBox = ({ icon: Icon, title, description, delay }) => {
    const theme = useTheme();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay }}
            style={{ flex: 1, minWidth: '280px', margin: '1rem' }}
        >
            <Box
                sx={{
                    background: 'rgba(0, 91, 187, 0.05)',
                    borderRadius: '12px',
                    padding: '1.1rem',
                    height: '100%',
                    border: '1px solid rgba(255, 215, 0, 0.1)',
                    transition: 'all 0.3s ease-in-out',
                    position: 'relative',
                    overflow: 'visible',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        background: 'rgba(0, 91, 187, 0.08)',
                        borderColor: 'rgba(255, 215, 0, 0.3)',
                        '& .benefit-icon': {
                            color: '#FFD700',
                            transform: 'scale(1.1)',
                        }
                    },
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '4px',
                        height: '100%',
                        background: 'linear-gradient(180deg, #005BBB 0%, #FFD700 100%)',
                    }
                }}
            >
                <div className="benefit-icon">
                    <IconAnimation Icon={Icon} iconColor="#FFD700" />
                </div>

                <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                        color: '#005BBB',
                        fontFamily: 'Montserrat, Arial, sans-serif',
                        fontWeight: 800,
                        letterSpacing: '0.04em',
                        marginBottom: '1rem',
                        fontSize: { xs: '1.35rem', md: '1.7rem' },
                    }}
                >
                    {title}
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: 'rgba(0, 0, 0, 0.87)',
                        fontFamily: 'Montserrat, Arial, sans-serif',
                        fontWeight: 500,
                        lineHeight: 1.75,
                        fontSize: { xs: '1.02rem', md: '1.13rem' },
                    }}
                >
                    {description}
                </Typography>
            </Box>
        </motion.div>
    );
};

const BenefitsSection = () => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                padding: { xs: '1rem 0.5rem', md: '2rem 1rem' },
                width: '100vw',
                position: 'relative',
                left: '50%',
                right: '50%',
                marginLeft: '-50vw',
                marginRight: '-50vw',
                marginTop: { xs: '-0.5rem', md: '-0.5rem' },
                background: 'linear-gradient(180deg, rgba(0, 91, 187, 0.02) 0%, rgba(255, 215, 0, 0.02) 100%)',
            }}
        >
            <Box
                sx={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    textAlign: 'center',
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Typography
                        variant="h2"
                        component="h2"
                        sx={{
                            fontWeight: 700,
                            marginBottom: '1.5rem',
                            fontSize: { xs: '2rem', md: '2.5rem' },
                            color: '#005BBB',
                            position: 'relative',
                            display: 'inline-block',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: '-12px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '80px',
                                height: '4px',
                                background: '#FFD700',
                                borderRadius: '2px',
                            }
                        }}
                    >
                        Чому варто обрати нашу платформу?
                    </Typography>
                </motion.div>

                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '1.2rem',
                    }}
                >
                    <BenefitBox
                        icon={ShieldIcon}
                        title="Повна анонімність"
                        description="Ваша конфіденційність - наш головний пріоритет. Усі відповіді зашифровані та анонімізовані для забезпечення повної конфіденційності та безпеки ваших відгуків."
                        delay={0.2}
                    />

                    <BenefitBox
                        icon={TrendingUpIcon}
                        title="Значущий вплив"
                        description="Нехай ваш голос буде почутий для реальних змін. Ваш відгук безпосередньо впливає на рішення та сприяє кращим результатам для всіх."
                        delay={0.4}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default BenefitsSection; 