import { Avatar } from "@mui/material";
import { styled } from '@mui/material/styles';
import { Link } from "react-router-dom";

// Styled Avatar with Ukrainian colors
const StyledAvatar = styled(Avatar)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    border: `2px solid ${theme.palette.secondary.main}`,
    height: 40,
    width: 40,
    '&:hover': {
        boxShadow: `0 0 8px ${theme.palette.secondary.main}`,
    },
}));

export const LogoAvatar = (props) => {
    return (
        <Link to={"/"}>
            <StyledAvatar {...props} className={"logo-animation"} alt={"ЗСУ Логістика"}>
                <strong>ЗСУ</strong>
            </StyledAvatar>
        </Link>
    );
}; 