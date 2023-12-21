import {SvgIcon} from "@mui/material";
import LogoIconSvg from "@images/logo_icon.svg?react";

export const LogoIcon = () => {
    return (<SvgIcon sx={{fontSize: 60}} component={LogoIconSvg} inheritViewBox/>
    )
}
