import { SurveyCard } from "@components/ui/surveys/SurveyCard.jsx";
import useResponsive from "@hooks/useResponsive";
import { Grid } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

export const SurveysGrid = (props) => {
    const { surveys, refetch, ...gridProps } = props;
    const [hoveredCardId, setHoveredCardId] = useState(null);
    const { isMobile, isSmallMobile } = useResponsive();
    const [localSurveys, setLocalSurveys] = useState([]);

    useEffect(() => {
        if (surveys && surveys.content) {
            setLocalSurveys(surveys.content);
        }
    }, [surveys]);

    const handleDeleteSurvey = (id) => {
        setLocalSurveys(prev => prev.filter(s => s.id !== id));
    };

    return (
        <Grid
            {...gridProps}
            container
            spacing={0}
            sx={{
                width: '100%',
                margin: '0 auto',
                justifyContent: { xs: 'center', md: 'flex-start' }
            }}
        >
            {localSurveys.map((survey) => (
                <Grid
                    item
                    key={survey.id}
                    xs={12}
                    sm={6}
                    md={4}
                    sx={{
                        transition: 'all 0.3s ease',
                        transform: !isMobile && hoveredCardId === survey.id ? 'scale(1.05)' : 'scale(1)',
                        zIndex: hoveredCardId === survey.id ? 1 : 0,
                        position: 'relative',
                        height: 'fit-content',
                        '&:hover': {
                            zIndex: 2,
                        },
                        px: 0,
                        mb: 0
                    }}
                >
                    <SurveyCard
                        survey={survey}
                        onMouseEnter={() => !isMobile && setHoveredCardId(survey.id)}
                        onMouseLeave={() => !isMobile && setHoveredCardId(null)}
                        refetch={refetch}
                        onDelete={handleDeleteSurvey}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

SurveysGrid.propTypes = {
    surveys: PropTypes.object.isRequired,
    refetch: PropTypes.func.isRequired
};