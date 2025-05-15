import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Box, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import { SiX as XIcon } from 'react-icons/si';

export default function Footer(props) {
    const year = new Date().getFullYear();
    return (
        <footer>
            <Box {...props} sx={{ bgcolor: 'grey.900', color: 'grey.100', py: 3, px: 2 }}>
                <Toolbar sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', minHeight: 0 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: { xs: 2, sm: 0 } }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            &copy; {year} Давид Окаянченко
                        </Typography>
                        <Typography variant="body2" color="grey.400">
                            Всі права захищено.
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <IconButton color="inherit" href="https://github.com/mrEkso" target="_blank" rel="noopener" aria-label="GitHub">
                            <GitHubIcon />
                        </IconButton>
                        <IconButton color="inherit" href="https://www.linkedin.com/in/davyd-o-748362281/" target="_blank" rel="noopener" aria-label="LinkedIn">
                            <LinkedInIcon />
                        </IconButton>
                        <IconButton color="inherit" href="https://x.com/okaianchen8995" target="_blank" rel="noopener" aria-label="X">
                            <XIcon size={24} />
                        </IconButton>
                    </Stack>
                </Toolbar>
            </Box>
        </footer>
    );
}
