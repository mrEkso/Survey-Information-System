import Content from "@components/Content";
import Header from "@components/Header";
import '@css/bootstrap.min.css';
import '@css/style.css';
import { Outlet } from "react-router-dom";

export default function App() {
    return (
        <>
            <Header />
            <Content />
            <Outlet />
        </>
    );
}