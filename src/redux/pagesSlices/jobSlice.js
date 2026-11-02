import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import { ApiRequests } from "../../service/ApiRequests";
import {
  catchAsync,
  handleLoadingErrorParamsForAsycThunk,
  reduxToolKitCaseBuilder,
} from "../../helpers/detectError.js";

export const createJobAsyncThunk = createAsyncThunk(
  "jobs/createJobAsyncThunk",
  catchAsync(async ({ data, callBack }) => {
    const response = await ApiRequests.createJob(data);
    if (callBack) callBack();
    return response?.data;
  })
);

export const getJobsAsyncThunk = createAsyncThunk(
  "jobs/getJobsAsyncThunk",
  catchAsync(async (params) => {
    const response = await ApiRequests.getJobs(params);
    return response?.data;
  })
);

export const getAvailableJobsAsyncThunk = createAsyncThunk(
  "jobs/getAvailableJobsAsyncThunk",
  catchAsync(async (params) => {
    const response = await ApiRequests.getAvailableJobs(params);
    return response?.data;
  })
);

export const getJobByIdAsyncThunk = createAsyncThunk(
  "jobs/getJobByIdAsyncThunk",
  catchAsync(async (id) => {
    const response = await ApiRequests.getJobById(id);
    return response?.data;
  })
);

export const updateJobByIdAsyncThunk = createAsyncThunk(
  "jobs/updateJobByIdAsyncThunk",
  catchAsync(async ({ id, data, callBack }) => {
    const response = await ApiRequests.updateJobById(id, data);
    if (callBack) callBack();
    return response?.data;
  })
);

export const deleteJobAsyncThunk = createAsyncThunk(
  "jobs/deleteJobAsyncThunk",
  catchAsync(async ({ id, callBack }) => {
    const response = await ApiRequests.deleteJob(id);
    if (callBack) callBack();
    return response?.data;
  })
);

const initialState = {
  jobs: {
    totalResults: 0,
    results: [],
    page: 1,
    limit: 10,
    totalPages: 1,
  },
  availableJobs: {
    totalResults: 0,
    results: [],
    page: 1,
    limit: 10,
    totalPages: 1,
  },
  job: {},
  loadings: {},
  errors: {},
  errorMessages: {},
  errorCodes: {},
  paramsForThunk: {},
};

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getJobsAsyncThunk.fulfilled, (state, action) => {
        state.jobs = action.payload;
      })
      .addCase(getAvailableJobsAsyncThunk.fulfilled, (state, action) => {
        state.availableJobs = action.payload;
      })
      .addCase(getJobByIdAsyncThunk.fulfilled, (state, action) => {
        state.job = action.payload;
      })
      .addMatcher(
        isAnyOf(
          ...reduxToolKitCaseBuilder([
            createJobAsyncThunk,
            updateJobByIdAsyncThunk,
            deleteJobAsyncThunk,
            getJobByIdAsyncThunk,
            getJobsAsyncThunk,
            getAvailableJobsAsyncThunk
          ])
        ),
        handleLoadingErrorParamsForAsycThunk
      );
  },
});

export default jobSlice.reducer
