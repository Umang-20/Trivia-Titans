import React from "react";
import { useSelector } from "react-redux";

const ScoreBoard = ({ scores }) => {
  const leaderboardArray = Object.entries(scores);
  //   console.log(leaderboardArray);

  // Sort the array based on the "total" value in descending order
  leaderboardArray.sort((a, b) => b[1].total - a[1].total);

  return (
    <div>
      <h1>Leaderboard</h1>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Total Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardArray.map((entry, index) => (
            <tr key={entry[0]}>
              <td>{index + 1}</td>
              <td>{entry[1].firstName}</td>
              <td>{entry[1].total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreBoard;
