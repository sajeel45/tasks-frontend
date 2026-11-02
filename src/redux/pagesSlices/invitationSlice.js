import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import { ApiRequests } from "../../service/ApiRequests";
import {
  catchAsync,
  handleLoadingErrorParamsForAsycThunk,
  reduxToolKitCaseBuilder,
} from "../../helpers/detectError.js";
import { handleModel } from "../layoutSlices/modelSlice.js";

export const createInvitationAsyncThunk = createAsyncThunk(
  "invitation/createInvitationAsyncThunk",
  catchAsync(async ({ data, callBack }) => {
    const response = await ApiRequests.createInvitation(data);
    if (callBack) callBack();
    return response?.data;
  })
);

export const getInvitationsAsyncThunk = createAsyncThunk(
  "invitation/getInvitationsAsyncThunk",
  catchAsync(async (params) => {
    const response = await ApiRequests.getInvitations(params);
    return response?.data;
  })
);
export const getInvitationByIdAsyncThunk = createAsyncThunk(
  "invitation/getInvitationByIdAsyncThunk",
  catchAsync(async (id) => {
    const response = await ApiRequests.getInvitationById(id);
    return response?.data;
  })
);

export const updateInvitationByIdAsyncThunk = createAsyncThunk(
  "invitation/updateInvitationByIdAsyncThunk",
  catchAsync(async ({ id, data, callBack }) => {
    const response = await ApiRequests.updateInvitationById(id, data);
    if (callBack) callBack();
    return response?.data;
  })
);

export const deleteInvitationAsyncThunk = createAsyncThunk(
  "invitation/deleteInvitationAsyncThunk",
  catchAsync(async ({ id, callBack }) => {
    const response = await ApiRequests.deleteInvitation(id);
    if (callBack) callBack();
    return response?.data;
  })
);

export const cancelInvitationAsyncThunk = createAsyncThunk(
  "invitation/cancelInvitationAsyncThunk",
  catchAsync(async ({ id, callBack }) => {
    const response = await ApiRequests.cancelInvitation(id);
    if (callBack) callBack();
    return response?.data;
  })
);

export const acceptInvitationAsyncThunk = createAsyncThunk(
  "invitation/acceptInvitationAsyncThunk",
  catchAsync(async ({ id, callBack }, { dispatch }) => {
    try {
      const response = await ApiRequests.acceptInvitation(id);
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

export const rejectInvitationAsyncThunk = createAsyncThunk(
  "invitation/rejectInvitationAsyncThunk",
  catchAsync(async ({ id, callBack }) => {
    const response = await ApiRequests.rejectInvitation(id);
    if (callBack) callBack();
    return response?.data;
  })
);

const initialState = {
  invitations: {
    totalResults: 0,
    results: [],
    page: 1,
    limit: 10,
    totalPages: 1,
  },
  invitation: {},
  loadings: {},
  errors: {},
  errorMessages: {},
  errorCodes: {},
  paramsForThunk: {},
};

const invitationSlice = createSlice({
  name: "invitations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getInvitationsAsyncThunk.fulfilled, (state, action) => {
        state.invitations = action.payload;
      })
      .addCase(getInvitationByIdAsyncThunk.fulfilled, (state, action) => {
        state.invitation = action.payload;
      })
      .addMatcher(
        isAnyOf(
          ...reduxToolKitCaseBuilder([
            createInvitationAsyncThunk,
            updateInvitationByIdAsyncThunk,
            deleteInvitationAsyncThunk,
            getInvitationsAsyncThunk,
            getInvitationByIdAsyncThunk,
            cancelInvitationAsyncThunk,
            acceptInvitationAsyncThunk,
            rejectInvitationAsyncThunk
          ])
        ),
        handleLoadingErrorParamsForAsycThunk
      );
  },
});

export default invitationSlice.reducer;
