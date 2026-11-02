import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import { ApiRequests } from "../../service/ApiRequests.js";
import {
  catchAsync,
  handleLoadingErrorParamsForAsycThunk,
  reduxToolKitCaseBuilder,
} from "../../helpers/detectError.js";


export const createDoctorAsyncThunk = createAsyncThunk(
  "doctor/createDoctorAsyncThunk",
  catchAsync(async ({ data, callBack }) => {
    const response = await ApiRequests.createDoctor(data);
    if (callBack) callBack();
    return response?.data;
  })
);

export const getDoctorsAsyncThunk = createAsyncThunk(
  "doctor/getDoctorsAsyncThunk",
  catchAsync(async ({ callBack }) => {
    const response = await ApiRequests.getDoctors();
    if (callBack) callBack();
    return response?.data;
  })
);

export const getDoctorByIdAsyncThunk = createAsyncThunk(
  "doctor/getDoctorByIdAsyncThunk",
  catchAsync(async ({ id }) => {
    const response = await ApiRequests.getDoctorById(id);
    return response?.data;
  })
);

export const deleteDoctorAsyncThunk = createAsyncThunk(
  "doctor/deleteDoctorAsyncThunk",
  catchAsync(async ({ id, callBack }) => {
    const response = await ApiRequests.deleteDoctor(id);
    if (callBack) callBack();
    return response?.data;
  })
)

export const updateDoctorAsyncThunk = createAsyncThunk(
  "doctor/updateDoctorAsyncThunk",
  catchAsync(async ({ id, data, callBack }) => {
    const response = await ApiRequests.updateDoctor(id, data);
    if (callBack) callBack();
    return response?.data;
  })
)

export const getAnalyticsAsyncThunk = createAsyncThunk(
  "doctor/getAnalyticsAsyncThunk",
  catchAsync(async ({ callBack }) => {
    const response = await ApiRequests.getAnalytics();
    if (callBack) callBack();
    return response?.data;
  })
);

export const getOngoingJobsAsyncThunk = createAsyncThunk(
  "doctor/getOngoingJobsAsyncThunk",
  catchAsync(async ({ callBack }) => {
    const response = await ApiRequests.getOngoingJobs();
    if (callBack) callBack();
    return response?.data;
  })
);


const initialState = {
  doctors: {
    totalResults: 0,
    results: [],
    page: 1,
    limit: 10,
    totalPages: 1,
  },
  ongoingJobs: [],
  analytics: {},
  doctor: {},
  loadings: {},
  errors: {},
  errorMessages: {},
  errorCodes: {},
  paramsForThunk : {},
};

const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {},
  extraReducers : (builder) => {
    builder
    .addCase(getDoctorsAsyncThunk.fulfilled, (state, action) => {
      state.doctors = action.payload;
    })
    .addCase(getDoctorByIdAsyncThunk.fulfilled, (state, action) => {
      state.doctor = action.payload;
    })
    .addCase(getAnalyticsAsyncThunk.fulfilled, (state, action) => {
      state.analytics = action.payload;
    })
    .addCase(getOngoingJobsAsyncThunk.fulfilled, (state, action) => {
      state.ongoingJobs = action.payload;
    })
    .addMatcher(
      isAnyOf(
        ...reduxToolKitCaseBuilder([
          createDoctorAsyncThunk,
          getDoctorsAsyncThunk,
          deleteDoctorAsyncThunk,
          getDoctorByIdAsyncThunk,
          updateDoctorAsyncThunk,
          getAnalyticsAsyncThunk,
          getOngoingJobsAsyncThunk,
        ])
      ),
      handleLoadingErrorParamsForAsycThunk
    );
  }
});

export default doctorSlice.reducer;

