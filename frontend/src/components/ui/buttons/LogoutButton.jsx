import PropTypes from "prop-types";
import {PrimaryButton} from "@components/ui/buttons/PrimaryButton.jsx";
import {useLogoutMutation} from "@services/store/api/authApi.jsx";
import useTopSnackbar from "@components/ui/snackbars/TopSnackbar.jsx";
import useBottomSnackbar from "@components/ui/snackbars/BottomSnackbar.jsx";

export const LogoutButton = ({children}) => {
    const [logout] = useLogoutMutation();
    const snackbar = useBottomSnackbar();

    const handleLogout = async () => {
        try {
            const {error, data} = await logout();
            if (error) {
                snackbar(error.message ? error.message : "An unexpected error occurred", "error");
                console.log(error);
            } else {
                snackbar(data.message, "success");
                console.log(data);
            }
        } catch (error) {
            snackbar("An unexpected error occurred", "error");
            console.log(error)
        }
    };

    return (<PrimaryButton onClick={handleLogout}>Log out</PrimaryButton>)
}

LogoutButton.propTypes = {
    children: PropTypes.string
};
