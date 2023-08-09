import Types from "../types/auth";

const initialState = {
  user: null,
  loading: true,
  mfa: false,
};

const AuthReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case Types.SET_USER_DATA:
      return {
        ...state,
        user: payload.user,
        loading: false,
      };
    case Types.SET_MFA:
      return {
        ...state,
        mfa: payload,
      };
    case Types.LOG_OUT_USER: {
      return {
        ...state,
        user: null,
        loading: true,
      };
    }
    default:
      return state;
  }
};

export default AuthReducer;
