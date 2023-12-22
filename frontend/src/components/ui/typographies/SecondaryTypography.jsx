import {Typography} from "@mui/material";
import PropTypes from "prop-types";

export const SecondaryTypography = (props) => {
    const {children, ...typographyProps} = props
    return (
        <>
            <Typography {...typographyProps} color="text.secondary">
                {children}
            </Typography>
        </>
    )
}

SecondaryTypography.propTypes = {
    children: PropTypes.string
}
