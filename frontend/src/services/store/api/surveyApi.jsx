import { urls } from "src/services/store/consts.jsx";
import { api } from "src/services/store/api.jsx";

export const surveyApi = api.injectEndpoints({
    endpoints: builder => ({
        getSurveys: builder.query({
            query: (page = 0) => ({
                url: `${urls.surveys.surveys}?page=${page}`
            }),
            providesTags: ['Survey']
        }),
        getUserSurveys: builder.query({
            query: (page = 0) => ({
                url: `${urls.surveys.my}?page=${page}`
            }),
            providesTags: ['Survey']
        }),
        getSurvey: builder.query({
            query: (id) => ({
                url: `${urls.surveys.surveys}/${id}`,
            }),
            providesTags: (result, error, id) => [{ type: 'Survey', id }]
        }),
        createSurvey: builder.mutation({
            query: (data) => ({
                url: urls.surveys.surveys, method: 'POST', body: data
            }),
            invalidatesTags: ['Survey']
        }),
        updateSurvey: builder.mutation({
            query: ({ id, data }) => ({
                url: `${urls.surveys.surveys}/${id}`, method: 'PUT', body: data
            }),
            invalidatesTags: ['Survey']
        }),
        deleteSurvey: builder.mutation({
            query: (id) => ({
                url: `${urls.surveys.surveys}/${id}`, method: 'DELETE',
            }),
            invalidatesTags: ['Survey']
        }),
    })
})

export const {
    useGetSurveysQuery,
    useGetUserSurveysQuery,
    useGetSurveyQuery,
    useCreateSurveyMutation,
    useUpdateSurveyMutation,
    useDeleteSurveyMutation
} = surveyApi

export const { endpoints: { getSurveys, getUserSurveys, getSurvey, createSurvey, updateSurvey, deleteSurvey } } = surveyApi