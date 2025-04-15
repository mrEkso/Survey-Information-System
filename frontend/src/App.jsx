import '@css/style.css'
import '@css/bootstrap.min.css'
import { Outlet } from "react-router-dom";
import Header from "@components/Header";
import Content from "@components/Content";

export default function App() {
    return (
        <>
            <Header />
            <Content />
            <Outlet />
        </>
    );
}