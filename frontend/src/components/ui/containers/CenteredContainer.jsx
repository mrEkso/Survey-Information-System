import {Container} from "@mui/material";
import PropTypes from "prop-types";

export const CenteredContainer = ({children}) => {
    return (<>
        <Container sx={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        }}>
            {children}
        </Container>
    </>)
}

CenteredContainer.propTypes = {
    children: PropTypes.object.isRequired
}