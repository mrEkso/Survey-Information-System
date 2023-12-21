import {urls} from "src/services/store/consts.jsx";
import {api} from "src/services/store/api.jsx";

export const surveyApi = api.injectEndpoints({
    endpoints: builder => ({
        getSurveys: builder.query({
            query: (page = 0) => ({
                url: `${urls.surveys.surveys}?page=${page}`
            })
        }), getSurvey: builder.query({
            query: (id) => ({
                url: `${urls.surveys.surveys}/${id}`,
            })
        }), createSurvey: builder.mutation({
            query: (data) => ({
                url: urls.surveys.surveys, method: 'POST', body: data
            }),
        }), updateSurvey: builder.mutation({
            query: ({id, data}) => ({
                url: `${urls.surveys.surveys}/${id}`, method: 'PUT', body: data
            }),
        }), deleteSurvey: builder.mutation({
            query: (id) => ({
                url: `${urls.surveys.surveys}/${id}`, method: 'DELETE',
            }),
        }),
    })
})

export const {
    useGetSurveysQuery, useGetSurveyQuery, useCreateSurveyMutation, useUpdateSurveyMutation, useDeleteSurveyMutation
} = surveyApi

export const {endpoints: {getSurveys, getSurvey, createSurvey, updateSurvey, deleteSurvey}} = surveyApi