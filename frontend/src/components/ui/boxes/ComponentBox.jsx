import {Box} from "@mui/material";
import PropTypes from "prop-types";

export const ComponentBox = (props) => {
    const {component: Component, ...boxProps} = props
    return (
        <>
            <Box {...boxProps}>
                <Component/>
            </Box>
        </>
    )
}

ComponentBox.propTypes = {
    component: PropTypes.elementType.isRequired
}