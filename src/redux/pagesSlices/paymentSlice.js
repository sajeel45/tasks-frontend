import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import { ApiRequests } from "../../service/ApiRequests.js";
import {
  catchAsync,
  handleLoadingErrorParamsForAsycThunk,
  reduxToolKitCaseBuilder,
} from "../../helpers/detectError.js";


export const checkoutPaymentAsyncThunk = createAsyncThunk(
  "payment/checkoutPaymentAsyncThunk",
  catchAsync(async ({ data, callBack }) => {
    const response = await ApiRequests.checkoutPayment(data);
    if (callBack) callBack();
    return response?.data;
  })
);


const initialState = {
  checkoutLink: null,
  loadings: {},
  errors: {},
  errorMessages: {},
  errorCodes: {},
  paramsForThunk: {},
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkoutPaymentAsyncThunk.fulfilled, (state, action) => {
        state.checkoutLink = action.payload;
      })
      .addMatcher(
        isAnyOf(
          ...reduxToolKitCaseBuilder([
            checkoutPaymentAsyncThunk,
          ])
        ),
        handleLoadingErrorParamsForAsycThunk
      );
  }
});

export default paymentSlice.reducer;

