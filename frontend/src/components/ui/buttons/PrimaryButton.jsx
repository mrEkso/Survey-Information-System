import { Button } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

export const PrimaryButton = React.forwardRef((props, ref) => {
    const { children, ...buttonProps } = props;
    return (<Button {...buttonProps}
        ref={ref}
        variant={"contained"}
        size={"medium"}
        color={"primary"}
        className={"opacity-animation"}
    >{children}</Button>)
});

PrimaryButton.propTypes = {
    children: PropTypes.string
};
