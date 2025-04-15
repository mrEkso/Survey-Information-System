import { Grid } from "@mui/material";
import { SurveyCard } from "@components/ui/surveys/SurveyCard.jsx";
import PropTypes from "prop-types";
import { useState } from "react";

export const SurveysGrid = (props) => {
    const { surveys, onSurveyDeleted, ...gridProps } = props;
    const [hoveredCardId, setHoveredCardId] = useState(null);

    return (
        <Grid {...gridProps} container spacing={3}>
            {surveys.content.map((survey) => (
                <Grid
                    item
                    key={survey.id}
                    xs={12}
                    sm={6}
                    md={4}
                    sx={{
                        transition: 'all 0.3s ease',
                        transform: hoveredCardId === survey.id ? 'scale(1.05)' : 'scale(1)',
                        zIndex: hoveredCardId === survey.id ? 1 : 0,
                        position: 'relative',
                        height: 'fit-content',
                        '&:hover': {
                            zIndex: 2,
                        }
                    }}
                >
                    <SurveyCard
                        survey={survey}
                        onMouseEnter={() => setHoveredCardId(survey.id)}
                        onMouseLeave={() => setHoveredCardId(null)}
                        onSurveyDeleted={onSurveyDeleted}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

SurveysGrid.propTypes = {
    surveys: PropTypes.object.isRequired,
    onSurveyDeleted: PropTypes.func
};