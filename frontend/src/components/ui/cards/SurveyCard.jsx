import { Button, Card, CardMedia, Typography, Box } from "@mui/material";
import logo from "@images/logo.png"
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: theme.shadows[8],
    }
}));

const AnimatedBox = styled(Box)(({ delay }) => ({
    position: 'absolute',
    transform: 'translateY(20px)',
    opacity: 0,
    transition: 'all 0.3s ease',
    transitionDelay: `${delay}ms`,
    '.MuiCard-root:hover &': {
        transform: 'translateY(0)',
        opacity: 1
    }
}));

const ContentBox = styled(Box)({
    position: 'relative',
    height: '200px'  // Фиксированная высота для контента
});

export const SurveyCard = ({ survey, onMouseEnter, onMouseLeave }) => {
    const { title, subtitle, id, createdAt, open, user } = survey;

    return (
        <StyledCard
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}>
                <CardMedia
                    sx={{
                        height: 140,
                        width: '100%',
                        objectFit: 'cover',
                    }}
                    image={logo}
                />
                <ContentBox sx={{ p: 2 }}>
                    <Box>
                        <Typography variant="h5" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {subtitle}
                        </Typography>
                    </Box>

                    <AnimatedBox delay={0} sx={{ top: 100 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Created by
                        </Typography>
                        <Typography variant="body2">
                            {user.username}
                        </Typography>
                    </AnimatedBox>

                    <AnimatedBox delay={100} sx={{ top: 140 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Created on
                        </Typography>
                        <Typography variant="body2">
                            {new Date(createdAt).toLocaleDateString()}
                        </Typography>
                    </AnimatedBox>

                    <AnimatedBox delay={200} sx={{ top: 180 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Status
                        </Typography>
                        <Typography variant="body2">
                            {open ? 'Open' : 'Closed'}
                        </Typography>
                    </AnimatedBox>

                    <Box sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 16,
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}>
                        <Button variant="outlined" size="small">Share</Button>
                        <Button
                            variant="contained"
                            size="small"
                            component={Link}
                            to={`/surveys/${id}`}
                            sx={{ ml: 1 }}
                        >
                            Learn More
                        </Button>
                    </Box>
                </ContentBox>
            </Box>
        </StyledCard>
    )
}

SurveyCard.propTypes = {
    survey: PropTypes.object.isRequired,
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired
};