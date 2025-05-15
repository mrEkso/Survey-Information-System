import { CenteredContainer } from "@components/ui/containers/CenteredContainer.jsx";
import { useRouteError } from "react-router-dom";

export default function RouteError() {
    const error = useRouteError();
    console.error(error);

    return (
        <CenteredContainer>
            <h1>Упс!</h1>
            <p>Виникла неочікувана помилка.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </CenteredContainer>
    );
}