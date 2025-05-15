import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery, urls } from 'src/services/store/consts.jsx';

export const messageApi = createApi({
    reducerPath: 'messageApi',
    baseQuery: baseQuery,
    tagTypes: ['Messages'],
    endpoints: (builder) => ({
        getMessages: builder.query({
            query: (surveyId) => `${urls.messages.messages}/${surveyId}`,
            providesTags: (result, error, surveyId) => [
                { type: 'Messages', id: surveyId }
            ],
        }),
        addMessage: builder.mutation({
            query: ({ surveyId, content }) => ({
                url: urls.messages.messages,
                method: 'POST',
                body: { surveyId, content },
            }),
            invalidatesTags: (result, error, { surveyId }) => [
                { type: 'Messages', id: surveyId }
            ],
        }),
    }),
});

export const { useGetMessagesQuery, useAddMessageMutation } = messageApi; 