import {SurveysGrid} from "@components/ui/grids/SurveysGrid.jsx";
import {Typography} from "@mui/material";
import {CenteredContainer} from "@components/ui/containers/CenteredContainer";

export default function Surveys() {
    return (<>
        <Typography
            sx={{textAlign: "center", fontWeight: 600}}
            variant="h2"
            mt={2}
            marginBottom={3}
        >Surveys:</Typography>
        <CenteredContainer>
            <SurveysGrid/>
        </CenteredContainer>
    </>)
}

