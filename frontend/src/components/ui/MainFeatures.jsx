import {Box, Paper, Typography} from "@mui/material";
import surveysImage from "@images/easy.webp";
import {theme} from "src/theme.jsx";
import {CenteredContainer} from "@components/ui/containers/CenteredContainer";

export const MainFeatures = () => {
    return (
        <Paper mt={2} sx={{backgroundColor: "gold.main", height: {xs: '130vh', md: '100vh'}, overflow: 'hidden'}}>
            <CenteredContainer>
                <Box sx={{
                    display: 'flex',
                    flexDirection: {xs: 'column', md: 'row'},
                    width: '100%',
                    height: '100%',
                    marginTop: "10%"
                }}>
                    <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                        <Typography className={'gradientText'} mt={2} sx={{
                            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                            WebkitBackgroundClip: 'text',
                            backgroundSize: '300% 300%',
                            color: 'transparent',
                            fontWeight: 'bold',
                            animation: 'gradientAnimation 5s ease infinite'
                        }}
                                    variant="h1"
                                    gutterBottom
                        >
                            Create your own survey
                        </Typography>
                    </Box>
                    <Box component={"img"} src={surveysImage} sx={{
                        flex: 1,
                        width: {xs: '100%', md: '80%'},
                        height: 'auto',
                        maxHeight: '100%',
                        objectFit: 'cover'
                    }}/>
                </Box>
            </CenteredContainer>
        </Paper>
    );
}