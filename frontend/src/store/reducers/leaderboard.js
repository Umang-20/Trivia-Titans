import Types from "../types/leaderboard";

const initialState = {
  data: [],
  total: 0,
  loading: false,
  error: null,
};

const LeaderboardReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case Types.GET_LEADERBOARD_DATA_LOADING:
      return {
        ...state,
        loading: true,
      };
    case Types.GET_LEADERBOARD_DATA_SUCCESS:
      return {
        ...state,
        data: payload.result,
        total: payload.total,
        loading: false,
      };
    case Types.GET_LEADERBOARD_DATA_FAILURE:
      return {
        ...state,
        error: payload.error,
        loading: false,
      };
    default:
      return state;
  }
};

export default LeaderboardReducer;
