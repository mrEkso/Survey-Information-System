import { CenteredContainer } from "@components/ui/containers/CenteredContainer";
import { SurveyFilterSearch } from "@components/ui/surveys/SurveyFilterSearch.jsx";
import { Typography } from "@mui/material";
import React, { useEffect, useState } from 'react';
import { useGetSurveysQuery } from "src/services/store/api/surveyApi.jsx";

export default function Surveys({ onSurveyPresenceChange }) {
    // For tracking the presence of surveys for the parent component
    const [hasSurveys, setHasSurveys] = useState(false);

    // Using effect to check for surveys after mounting
    useEffect(() => {
        const checkSurveys = async () => {
            try {
                // Make a manual request to check for the presence of surveys
                const result = await useGetSurveysQuery.initiate({ page: 0 }).unwrap();
                const hasContent = result && result.content && result.content.length > 0;
                setHasSurveys(hasContent);
                if (onSurveyPresenceChange) {
                    onSurveyPresenceChange(hasContent);
                }
            } catch (error) {
                setHasSurveys(false);
                if (onSurveyPresenceChange) {
                    onSurveyPresenceChange(false);
                }
            }
        };

        checkSurveys();
    }, [onSurveyPresenceChange]);

    return (<>
        <Typography
            sx={{
                textAlign: "center",
                fontWeight: 600,
                color: "#007bff",
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                mt: { xs: 4, md: 2 },
                mb: { xs: 2, md: 3 },
                px: 2
            }}
            variant="h3"
        >Опитування:</Typography>
        <CenteredContainer
            id="surveys"
            sx={{
                height: 'auto',
                px: { xs: 2, sm: 3, md: 4 }
            }}
        >
            <SurveyFilterSearch
                useQueryHook={useGetSurveysQuery}
                emptyStateMessage="На даний момент немає доступних опитувань. Завітайте пізніше!"
            />
        </CenteredContainer>
    </>);
}

