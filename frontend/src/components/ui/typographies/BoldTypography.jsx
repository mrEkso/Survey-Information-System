import {Typography} from "@mui/material";
import PropTypes from "prop-types";

export const BoldTypography = (props) => {
    const {children, ...typographyProps} = props
    return (<Typography{...typographyProps}
                       sx={{fontWeight: 600}}>
        {children}
    < /Typography>)
}

BoldTypography.propTypes = {
    children: PropTypes.string
}
