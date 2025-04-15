import React from 'react';
import {MainFeatures} from '@components/ui/MainFeatures.jsx';
import Surveys from '@components/ui/surveys/Surveys.jsx';
import {Outlet} from "react-router-dom";

export default function Content() {
    return (
        <>
            <main>
                <MainFeatures />
                <Surveys />
                <Outlet/>
            </main>
        </>
    );
}