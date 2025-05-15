import { api } from "src/services/store/api.jsx";
import { urls } from "src/services/store/consts.jsx";

export const voteApi = api.injectEndpoints({
    endpoints: builder => ({
        vote: builder.mutation({
            query: (data) => ({
                url: urls.vote.vote,
                method: 'POST',
                body: data
            }),
            invalidatesTags: (result, error, data) => [
                { type: 'Survey', id: data.surveyId }
            ]
        }),
        unvote: builder.mutation({
            query: (surveyId) => ({
                url: `${urls.vote.vote}/${surveyId}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, surveyId) => [
                { type: 'Survey', id: surveyId }
            ]
        })
    })
})

export const {
    useVoteMutation,
    useUnvoteMutation
} = voteApi

export const { endpoints: { vote, unvote } } = voteApi