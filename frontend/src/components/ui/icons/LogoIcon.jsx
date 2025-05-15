import LogoIconSvg from "@images/logo_icon.svg?react";
import { SvgIcon } from "@mui/material";

export const LogoIcon = () => {
    return (<SvgIcon sx={{ fontSize: 60 }} component={LogoIconSvg} inheritViewBox />
    )
}
