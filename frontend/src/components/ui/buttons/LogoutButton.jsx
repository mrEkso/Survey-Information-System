import { PrimaryButton } from "@components/ui/buttons/PrimaryButton.jsx";
import useBottomSnackbar from "@components/ui/snackbars/BottomSnackbar.jsx";
import { useLogoutMutation } from "@services/store/api/authApi.jsx";
import { logout as logoutAction } from "@services/store/slices/userSlice.jsx";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

export const LogoutButton = ({ children }) => {
    const [logout] = useLogoutMutation();
    const snackbar = useBottomSnackbar();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            const result = await logout().unwrap();
            snackbar(result.message, "success");
            dispatch(logoutAction());
        } catch (error) {
            snackbar(error?.data?.message || "Сталася неочікувана помилка", "error");
            console.log(error);
        }
    };

    return (<PrimaryButton onClick={handleLogout}>Вийти</PrimaryButton>)
}

LogoutButton.propTypes = {
    children: PropTypes.string
};
