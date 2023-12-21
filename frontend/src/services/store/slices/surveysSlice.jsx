import {createSlice} from '@reduxjs/toolkit'
import {surveyApi} from "src/services/store/api/surveyApi.jsx";

const slice = createSlice({
    name: 'surveys', initialState: {
        surveys: []
    }, reducers: {
        logout: () => {
            return {
                surveys: []
            }
        }
    }, extraReducers: (builder) => {
        builder
            .addMatcher(surveyApi.endpoints.getSurveys.matchFulfilled, (state, action) => {
                state.surveys = action.payload;
            })
    }
})

export const {getSurveys} = slice.actions
export default slice.reducer

export const selectSurveys = (state) => state.surveys.surveys