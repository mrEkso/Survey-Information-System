import {Grid} from "@mui/material";
import {SurveyCard} from "@components/ui/cards/SurveyCard.jsx";
import {useGetSurveysQuery} from "src/services/store/api/surveyApi.jsx";
import {SecondaryTypography} from "@components/ui/typographies/SecondaryTypography.jsx";
import {useState} from "react";
import {GoldPagination} from "@components/ui/paginations/GoldPagination";

export const SurveysGrid = (props) => {
    const [page, setPage] = useState(1);
    const {data: surveys, isLoading} = useGetSurveysQuery(page)

    const handlePaginationChange = (event, value) => {
        setPage(value);
    };

    return (<>
        {isLoading ? (<SecondaryTypography>Loading...</SecondaryTypography>) : surveys ? (
            <Grid {...props} justifyContent="center" spacing={3} container>
                {surveys.content.map(survey => (<Grid item xs={12} sm={6} md={4} key={survey.id}>
                    <SurveyCard survey={survey}/>
                </Grid>))}
                <GoldPagination page={surveys.number}
                                count={surveys.size}
                                onChange={handlePaginationChange}/>
            </Grid>) : null}
    </>)
}

