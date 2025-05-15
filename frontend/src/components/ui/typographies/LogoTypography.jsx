import { Typography } from "@mui/material";

export const LogoTypography = (props) => {
    return (
        <Typography
            {...props}
            variant="h4"
            sx={{
                display: { xs: 'none', sm: 'block' },
                fontWeight: 600,
                letterSpacing: '.1rem',
            }}
            color={"white"}
        >
            ЗСУ Логістика
        </Typography>
    )
}
