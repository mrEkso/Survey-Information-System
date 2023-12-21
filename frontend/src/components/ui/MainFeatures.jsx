import {Container, Grid, Paper, Typography} from "@mui/material";
import survey from "@images/survey.jpg"
import {theme} from "src/theme.jsx";
import {SecondaryButton} from "@components/ui/buttons/SecondaryButton";

export const MainFeatures = (props) => {
    return (
        <Paper {...props}
               style={{
                   position: 'relative',
                   minHeight: '80vh',
                   background: `url(${survey})`,
                   color: theme.palette.common.black,
                   marginTop: theme.spacing(1),
                   marginBottom: theme.spacing(4),
                   backgroundSize: '50% 140%',
                   objectFit: 'cover',
                   backgroundRepeat: 'no-repeat',
                   backgroundPosition: 'right',
                   backgroundBlendMode: 'multiply',
               }}>
            <Container>
                <Grid container>
                    <Grid item md={6} sx={{marginBottom: theme.spacing(4)}}>
                        <Typography sx={{marginTop: theme.spacing(20)}}
                                    variant="h1"
                                    mt={2}
                                    gutterBottom
                        >Create your own survey</Typography>
                        <SecondaryButton>Learn more</SecondaryButton>
                    </Grid>
                </Grid>
            </Container>
        </Paper>
    )
}