import {Button} from "@mui/material";
import PropTypes from "prop-types";

export const PrimaryButton = (props) => {
    const {children, ...buttonProps} = props;
    return (<Button {...buttonProps}
                    variant={"contained"}
                    size={"medium"}
                    color={"primary"}
                    className={"opacity-animation"}
    >{children}</Button>)
}

PrimaryButton.propTypes = {
    children: PropTypes.string
};
