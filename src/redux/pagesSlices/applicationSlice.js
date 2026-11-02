import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import { ApiRequests } from "../../service/ApiRequests";
import {
  catchAsync,
  handleLoadingErrorParamsForAsycThunk,
  reduxToolKitCaseBuilder,
} from "../../helpers/detectError.js";
import { handleModel } from "../layoutSlices/modelSlice.js";

export const createApplicationAsyncThunk = createAsyncThunk(
  "application/createApplicationAsyncThunk",
  catchAsync(async ({ data, callBack }, { dispatch }) => {
    try {
      const response = await ApiRequests.createApplication(data);
      if (callBack) callBack();
      return response?.data;
    } catch (error) {
      if (error?.response?.data?.isSubscriptionIssue) {
        dispatch(
          handleModel({
            model: "packageModal",
            state: true,
            args: {},
          })
        );
      } else {
        throw error;
      }
    }
  })
);

export const getApplicationsAsyncThunk = createAsyncThunk(
  "application/getApplicationsAsyncThunk",
  catchAsync(async (params) => {
    const response = await ApiRequests.getApplications(params);
    return response?.data;
  })
);

export const getAvailableApplicationsAsyncThunk = createAsyncThunk(
  "application/getAvailableApplicationsAsyncThunk",
  catchAsync(async (params) => {
    const response = await ApiRequests.getAvailableApplications(params);
    return response?.data;
  })
);

export const getApplicationByIdAsyncThunk = createAsyncThunk(
  "application/getApplicationByIdAsyncThunk",
  catchAsync(async (id) => {
    const response = await ApiRequests.getApplicationById(id);
    return response?.data;
  })
);

export const updateApplicationByIdAsyncThunk = createAsyncThunk(
  "application/updateApplicationByIdAsyncThunk",
  catchAsync(async ({ id, data, callBack }) => {
    const response = await ApiRequests.updateApplicationById(id, data);
    if (callBack) callBack();
    return response?.data;
  })
);

export const deleteApplicationAsyncThunk = createAsyncThunk(
  "application/deleteApplicationAsyncThunk",
  catchAsync(async ({ id, callBack }) => {
    const response = await ApiRequests.deleteApplication(id);
    if (callBack) callBack();
    return response?.data;
  })
);

export const getContractsAsyncThunk = createAsyncThunk(
  "application/getContractsAsyncThunk",
  catchAsync(async (params) => {
    const response = await ApiRequests.getContracts(params);
    return response?.data;
  })
);

export const acceptApplicationAsyncThunk = createAsyncThunk(
  "application/acceptApplicationAsyncThunk",
  catchAsync(async ({ id, callBack }) => {
    const response = await ApiRequests.acceptApplication(id);
    if (callBack) callBack();
    return response?.data;
  })
);

export const rejectApplicationAsyncThunk = createAsyncThunk(
  "application/rejectApplicationAsyncThunk",
  catchAsync(async ({ id, callBack }) => {
    const response = await ApiRequests.rejectApplication(id);
    if (callBack) callBack();
    return response?.data;
  })
);

export const withdrawApplicationAsyncThunk = createAsyncThunk(
  "application/withdrawApplicationAsyncThunk",
  catchAsync(async ({ id, callBack }) => {
    const response = await ApiRequests.withdrawApplication(id);
    if (callBack) callBack();
    return response?.data;
  })
);

const initialState = {
  applications: {
    totalResults: 0,
    results: [],
    page: 1,
    limit: 10,
    totalPages: 1,
  },
  availableApplications: {
    totalResults: 0,
    results: [],
    page: 1,
    limit: 10,
    totalPages: 1,
  },
  contracts: {
    totalResults: 0,
    results: [],
    page: 1,
    limit: 10,
    totalPages: 1,
  },
  application: {},
  loadings: {},
  errors: {},
  errorMessages: {},
  errorCodes: {},
  paramsForThunk: {},
};

const applicationSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getApplicationsAsyncThunk.fulfilled, (state, action) => {
        state.applications = action.payload;
      })
      .addCase(getAvailableApplicationsAsyncThunk.fulfilled, (state, action) => {
        state.availableApplications = action.payload;
      })
      .addCase(getApplicationByIdAsyncThunk.fulfilled, (state, action) => {
        state.application = action.payload;
      })
      .addCase(getContractsAsyncThunk.fulfilled, (state, action) => {
        state.contracts = action.payload;
      })
      .addMatcher(
        isAnyOf(
          ...reduxToolKitCaseBuilder([
            createApplicationAsyncThunk,
            updateApplicationByIdAsyncThunk,
            deleteApplicationAsyncThunk,
            getApplicationByIdAsyncThunk,
            getApplicationsAsyncThunk,
            getAvailableApplicationsAsyncThunk,
            getContractsAsyncThunk,
            acceptApplicationAsyncThunk,
            rejectApplicationAsyncThunk,
            withdrawApplicationAsyncThunk
          ])
        ),
        handleLoadingErrorParamsForAsycThunk
      );
  },
});

export default applicationSlice.reducer
