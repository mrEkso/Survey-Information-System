import {Box, Paper, Typography} from "@mui/material";
import easyImage from "@images/easy.webp"
import {theme} from "src/theme.jsx";
import {SecondaryButton} from "@components/ui/buttons/SecondaryButton.jsx";
import {CenteredContainer} from "@components/ui/containers/CenteredContainer";

export const MainFeatures = () => {
    return (<>
        <Paper mt={2} sx={{backgroundColor: "gold.main"}}>
            <CenteredContainer>
                <Box component={"img"} src={easyImage} mr={8} mt={3}
                     sx={{width: '100%', maxWidth: 600, height: 'auto'}}
                ></Box>
                <Typography className={'gradientText'} mt={2} sx={{
                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                    WebkitBackgroundClip: 'text',
                    backgroundSize: '200% 200%',
                    color: 'transparent',
                    fontWeight: 'bold',
                }}
                            variant="h2"
                            gutterBottom
                >Create your own survey</Typography>
                <SecondaryButton sx={{marginTop: theme.spacing(1), marginBottom: theme.spacing(2)}}>Learn
                    more</SecondaryButton>
            </CenteredContainer>
        </Paper>
    </>)
}