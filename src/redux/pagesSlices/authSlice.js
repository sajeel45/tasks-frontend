import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import { ApiRequests } from "../../service/ApiRequests";
import {
  catchAsync,
  handleLoadingErrorParamsForAsycThunk,
  reduxToolKitCaseBuilder,
} from "../../helpers/detectError.js";
import { toast } from "react-toastify";

// user Login With Credentials
export const userLoginAsyncThunk = createAsyncThunk(
  "auth/userLoginAsyncThunk",
  catchAsync(async ({ email, password, role, router }) => {
    const response = await ApiRequests.login({ email, password, role });
    if (response) {
      if (response?.status === 200) {
        toast.success("Login Successful!", {
          autoClose: 2000,
        });
        router("/dashboard");
      } else {
        router("/login");
        toast.error(response.error);
      }
    }
    console.log("🚀 ~ catchAsync ~ response:", response)
    return response?.data;
  })
);
// user Login With Credentials
export const authenticateAsyncThunk = createAsyncThunk(
  "auth/authenticateAsyncThunk",
  catchAsync(async () => {
    try {

      const response = await ApiRequests.authenticate();
      if (response) {
        if (response?.status === 200) {
          // history.back()
          // console.log("move")
        } else {
          toast.error(response.error);
        }
      }
      return response?.data;
    } catch (error) {
      // Handle the error here
      console.error("Error during authentication:", error);
      return null;
    }
  })
);
// user Login With Credentials
export const refreshTokensAsyncThunk = createAsyncThunk(
  "auth/refreshTokensAsyncThunk",
  catchAsync(async ({ callBack }) => {
    // const response = await ApiRequests.refreshTokens({ refreshToken: JSON.parse(refreshToken) });
    const refreshToken = JSON.parse(localStorage.getItem("app-refresh-token"));
    const response = await ApiRequests.refreshTokens({ refreshToken });
    if (callBack) callBack();
    if (response) {
      if (response?.status === 200) {
        // history("/")
      } else {
        toast.error(response.error);
      }
    }
    return response.data;
  })
);

export const userLogoutAsyncThunk = createAsyncThunk(
  "auth/userLogoutAsyncThunk",
  catchAsync(async ({ router }) => {
    const refreshToken = localStorage.getItem("doctor-refresh-token");

    if (!refreshToken) {
      toast.error("No refresh token found, unable to log out.");
      return;
    }

    const parsedRefreshToken = JSON.parse(refreshToken);

    const response = await ApiRequests.logout({ refreshToken: parsedRefreshToken });

    if (response) {
      if (response?.status === 204) {
        // Clear localStorage
        localStorage.removeItem('doctor-access-token');
        localStorage.removeItem('doctor-refresh-token');
        localStorage.removeItem('user');
        localStorage.removeItem('doctor');


        toast.success("Logged out successfully!", {
          autoClose: 2000,
        });

        router("/login");
      } else {
        toast.error(response.error);
      }
    }
    return true;
  })
);

// user register With Credentials
export const userRegisterAsyncThunk = createAsyncThunk(
  "auth/userRegisterAsyncThunk",
  catchAsync(async ({ firstName, lastName, userName, email, password, role, phoneNumber }, { callBack }) => {
    const response = await ApiRequests.register({ firstName, lastName, userName, email, password, role, phoneNumber });
    if (response) {
      if (response?.status === 201) {
        toast.success("Registered Successfully!!!", {
          autoClose: 2000,
        });

      } else {
        toast.error(response.error);
      }
    }
    if (callBack) callBack();
    return response?.data;
  })
);

export const updateUserAsyncThunk = createAsyncThunk(
  "auth/updateUserAsyncThunk",
  catchAsync(async ({ data, callBack }) => {
    const response = await ApiRequests.updateUser(data);
    toast.success("Updated Successfully!!!", {
      autoClose: 2000,
    });
    if (callBack) callBack();
    return response?.data;
  })
);

export const updateProfileAsyncThunk = createAsyncThunk(
  "auth/updateProfileAsyncThunk",
  catchAsync(async ({ data, callBack }) => {
    const response = await ApiRequests.updateProfile(data);
    if (callBack) callBack();
    return response?.data;
  })
);

const initialState = {
  //news states
  user: null,
  profile: null,
  tokens: null,
  // manager states
  errors: {},
  loadings: {},
  errorMessages: {},
  errorCodes: {},
  paramsForThunk: {},
};

const blogSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    storeUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLoginAsyncThunk.fulfilled, (state, action) => {
        state.user = action.payload?.user;
        state.profile = action.payload?.profile;
        state.tokens = action.payload?.tokens;
        localStorage.setItem(
          "doctor-access-token",
          JSON.stringify(action.payload?.tokens?.access?.token)
        );
        localStorage.setItem(
          "doctor-refresh-token",
          JSON.stringify(action.payload?.tokens?.refresh?.token)
        );
        localStorage.setItem("user", JSON.stringify(action.payload?.user));
        localStorage.setItem("doctor", JSON.stringify(action.payload?.profile));
      })
      .addCase(userLogoutAsyncThunk.fulfilled, (state) => {
        state.user = null;
        state.profile = null;
        state.tokens = null;
        // history('/login')

      })
      .addCase(userRegisterAsyncThunk.fulfilled, (state, action) => {
        state.user = action.payload?.user;
        state.profile = action.payload?.profile;
        state.tokens = action.payload?.tokens;
        localStorage.setItem(
          "doctor-access-token",
          JSON.stringify(action.payload?.tokens?.access?.token)
        );
        localStorage.setItem(
          "doctor-refresh-token",
          JSON.stringify(action.payload?.tokens?.refresh?.token)
        );
        localStorage.setItem("user", JSON.stringify(action.payload?.user));
        localStorage.setItem("doctor", JSON.stringify(action.payload?.profile));
      })
      .addCase(authenticateAsyncThunk.fulfilled, (state, action) => {
        state.user = action.payload?.user;
        state.profile = action.payload?.profile;
        localStorage.setItem(
          'user',
          JSON.stringify(action.payload?.user)
        );
        localStorage.setItem("doctor", JSON.stringify(action.payload?.profile));
      })
      .addCase(refreshTokensAsyncThunk.fulfilled, (state, action) => {
        // state.user = action.payload;
        // console.log("refreshTokensAsyncThunk:", action.payload)
        localStorage.setItem(
          "doctor-access-token",
          JSON.stringify(action.payload?.access?.token)
        );
        localStorage.setItem(
          "doctor-refresh-token",
          JSON.stringify(action.payload?.refresh?.token)
        );
      })
      .addCase(updateUserAsyncThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(updateProfileAsyncThunk.fulfilled, (state, action) => {
        state.profile = action.payload.profile;
      })

      // im using addMatcher to manage the asyncthunksMehtod actions like fullfilled,pending,rejected and also to manage the errors loading and error messages and async params
      .addMatcher(
        // isAsyncThunk will run when the action is an asyncthunk exists from giver asycntthunks
        isAnyOf(
          // reduxToolKitCaseBuilder helper make fullfilled, pending, and rejected cases
          ...reduxToolKitCaseBuilder([
            userLoginAsyncThunk,
            userRegisterAsyncThunk,
            refreshTokensAsyncThunk,
            authenticateAsyncThunk,
            userLogoutAsyncThunk,
            updateUserAsyncThunk,
            updateProfileAsyncThunk
          ])
        ),
        handleLoadingErrorParamsForAsycThunk
      );
  },
});

export default blogSlice.reducer;
export const { setLoading, storeUser } = blogSlice.actions;
