import { combineReducers } from "redux";

import AuthReducer from "./auth";
import LeaderboardReducer from "./leaderboard";
import GameScoreReducer from "./gameScore";

const reducers = {
  auth: AuthReducer,
  leaderboard: LeaderboardReducer,
  gameScore: GameScoreReducer,
};

const combinedReducer = combineReducers(reducers);

export default combinedReducer;
