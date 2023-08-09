import Types from "../types/gameScore";

const initialState = {
  scores: null,
  isPaused: false,
};

const GameScoreReducer = (state = initialState, action) => {
  const { type, payload } = action;
  console.log("PAYLOAD ==========");
  console.log(payload);

  switch (type) {
    case Types.SET_GAME_SCORE:
      return {
        ...state,
        scores: payload.scores,
      };

    default:
      return state;
  }
};

export default GameScoreReducer;
