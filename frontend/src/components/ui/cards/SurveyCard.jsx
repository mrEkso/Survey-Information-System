import {Button, Card, CardActions, CardContent, CardMedia, Typography} from "@mui/material";
import logo from "@images/logo.png"
import PropTypes from "prop-types";

export const SurveyCard = ({survey}) => {
    const {title, subtitle} = survey
    return (
        <Card sx={{maxWidth: 345}}>
            <CardMedia
                sx={{height: 140}}
                image={logo}
            />
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {subtitle}
                </Typography>
            </CardContent>
            <CardActions>
                <Button variant={"outlined"} size="small">Share</Button>
                <Button variant={"outlined"} size="small">Learn More</Button>
            </CardActions>
        </Card>
    )
}


SurveyCard.propTypes = {
    survey: PropTypes.object.isRequired
}