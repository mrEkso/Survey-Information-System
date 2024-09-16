import {Container} from "@mui/material";
import PropTypes from "prop-types";

export const CenteredContainer = ({children, sx}) => {
    return (
        <Container sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            ...sx
        }}>
            {children}
        </Container>
    );
}

CenteredContainer.propTypes = {
    children: PropTypes.node,
    sx: PropTypes.object
}