import {SurveysGrid} from "@components/ui/grids/SurveysGrid.jsx";
import {Typography} from "@mui/material";
import {CenteredContainer} from "@components/ui/containers/CenteredContainer";
import {useGetSurveysQuery} from "src/services/store/api/surveyApi.jsx";
import {SecondaryTypography} from "@components/ui/typographies/SecondaryTypography.jsx";
import {GoldPagination} from "@components/ui/paginations/GoldPagination.jsx";
import {useState} from "react";
import {theme} from "src/theme.jsx";

export default function Surveys() {
    const [page, setPage] = useState(0);
    const {data: surveys, isLoading} = useGetSurveysQuery(page)

    const handlePaginationChange = (event, value) => {
        setPage(value - 1);
    };

    return (<>
        <Typography
            sx={{textAlign: "center", fontWeight: 600, color: "#007bff"}}
            variant="h3"
            mt={2}
            marginBottom={3}
        >Surveys:</Typography>
        <CenteredContainer>
            {isLoading ? (<SecondaryTypography>Loading...</SecondaryTypography>) : surveys ? (<>
                <SurveysGrid surveys={surveys} marginBottom={3}/>
                <GoldPagination sx={{marginBottom: theme.spacing(2)}}
                                page={page + 1}
                                count={surveys.totalPages}
                                onChange={handlePaginationChange}/>
            </>) : null}
        </CenteredContainer>
    </>)
}

