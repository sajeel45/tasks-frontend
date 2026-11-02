// ** Reducers Imports
import auth from "./pagesSlices/authSlice";
import model from "./layoutSlices/modelSlice";

import error from "./errors/handleErrorsAndPayloads";
import doctor from "./pagesSlices/doctorSlice";
import jobs from "./pagesSlices/jobSlice"
import application from "./pagesSlices/applicationSlice"
import chat from "./pagesSlices/chatSlice"
import payment from "./pagesSlices/paymentSlice"
import invitations from "./pagesSlices/invitationSlice";
import { combineReducers } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  error,
  auth,
  model,
  doctor,
  jobs,
  application,
  invitations,
  chat,
  payment
});

export default rootReducer;
