import Types from "../types/gameScore";

export const setGameScore = (scores) => {
  return async function (dispatch) {
    dispatch({
      type: Types.SET_GAME_SCORE,
      payload: {
        scores,
      },
    });
  };
};
