import {Button} from "@mui/material";
import PropTypes from "prop-types";

export const SecondaryButton = (props) => {
    const {children, ...buttonProps} = props;
    return (<Button {...buttonProps}
                    variant={"contained"}
                    size={"medium"}
                    color={"secondary"}
                    className={"opacity-animation"}
    >{children}</Button>)
}

SecondaryButton.propTypes = {
    children: PropTypes.string
};
