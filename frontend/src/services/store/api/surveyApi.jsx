import { api } from "src/services/store/api.jsx";
import { urls } from "src/services/store/consts.jsx";

export const surveyApi = api.injectEndpoints({
    endpoints: builder => ({
        getSurveys: builder.query({
            query: ({ page = 0, searchText = '', open, sort } = {}) => {
                let url = `${urls.surveys.surveys}?page=${page}`;
                if (searchText) url += `&searchText=${encodeURIComponent(searchText)}`;
                if (typeof open !== 'undefined') url += `&open=${open === true ? 'true' : 'false'}`;
                if (sort && sort !== 'default') url += `&sort=${sort}`;
                return { url };
            },
            providesTags: ['Survey']
        }),
        getUserSurveys: builder.query({
            query: ({ page = 0, searchText = '', open, sort } = {}) => {
                let url = `${urls.surveys.my}?page=${page}`;
                if (searchText) url += `&searchText=${encodeURIComponent(searchText)}`;
                if (typeof open !== 'undefined') url += `&open=${open === true ? 'true' : 'false'}`;
                if (sort && sort !== 'default') url += `&sort=${sort}`;
                return { url };
            },
            providesTags: ['Survey']
        }),
        getAllUserSurveys: builder.query({
            query: () => ({
                url: `${urls.surveys.myAll}`
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
        uploadSurveyImage: builder.mutation({
            query: ({ id, image }) => {
                const formData = new FormData();
                formData.append('image', image);
                return {
                    url: `${urls.surveys.surveys}/${id}/image`,
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: (result, error, { id }) => [{ type: 'Survey', id }],
        }),
        getSurveyImage: builder.query({
            query: (fileName) => ({
                url: `${urls.surveys.images}/${fileName}`,
                responseHandler: (response) => response.blob(),
            }),
            transformResponse: (response) => {
                return URL.createObjectURL(response);
            },
        }),
    })
})

export const {
    useGetSurveysQuery,
    useGetUserSurveysQuery,
    useGetAllUserSurveysQuery,
    useGetSurveyQuery,
    useCreateSurveyMutation,
    useUpdateSurveyMutation,
    useDeleteSurveyMutation,
    useUploadSurveyImageMutation,
    useGetSurveyImageQuery,
} = surveyApi

export const { endpoints: { getSurveys, getUserSurveys, getAllUserSurveys, getSurvey, createSurvey, updateSurvey, deleteSurvey } } = surveyApi