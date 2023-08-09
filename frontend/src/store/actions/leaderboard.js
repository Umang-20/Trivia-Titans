import Types from "../types/leaderboard";
import axios from "axios";

export const getLeaderboardData = (body) => {
  return async function (dispatch) {
    try {
      dispatch({
        type: Types.GET_LEADERBOARD_DATA_LOADING,
      });

      const { data } = await axios.post(
        "https://us-central1-project-csci5410.cloudfunctions.net/leaderboard",
        body
      );
      dispatch({
        type: Types.GET_LEADERBOARD_DATA_SUCCESS,
        payload: {
          result: data.result,
          total: data.total,
        },
      });
    } catch (error) {
      dispatch({
        type: Types.GET_LEADERBOARD_DATA_FAILURE,
        payload: {
          error,
        },
      });
    }
  };
};
