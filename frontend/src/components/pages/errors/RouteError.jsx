import {useRouteError} from "react-router-dom";
import {CenteredContainer} from "@components/ui/containers/CenteredContainer.jsx";

export default function RouteError() {
    const error = useRouteError();
    console.error(error);

    return (
        <CenteredContainer>
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </CenteredContainer>
    );
}