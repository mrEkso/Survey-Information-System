import { Button } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

export const SecondaryButton = React.forwardRef((props, ref) => {
    const { children, ...buttonProps } = props;
    return (<Button {...buttonProps}
        ref={ref}
        variant={"contained"}
        size={"medium"}
        color={"secondary"}
        className={"opacity-animation"}
    >{children}</Button>)
});

SecondaryButton.propTypes = {
    children: PropTypes.string
};
