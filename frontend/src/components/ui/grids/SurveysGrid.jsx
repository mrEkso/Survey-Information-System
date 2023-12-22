import {Grid} from "@mui/material";
import {SurveyCard} from "@components/ui/cards/SurveyCard.jsx";
import PropTypes from "prop-types";

export const SurveysGrid = (props) => {
    const {surveys, ...gridProps} = props
    return (<>
        <Grid {...gridProps} justifyContent="center" spacing={3} container>
            {surveys.content.map(survey => (<Grid item xs={12} sm={6} md={4} key={survey.id}>
                <SurveyCard survey={survey}/>
            </Grid>))}
        </Grid>
    </>)
}

SurveysGrid.propTypes = {
    surveys: PropTypes.object.isRequired
}


