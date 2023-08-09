import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import Typography from "@mui/material/Typography";
import styles from "./browseGames.module.css";
import GameCard from "../../components/GameCard";
import GameFilters from "../../components/GameFilters";

const BrowseGamesPage = () => {
  const data = [
    {
      gameName: "Test game 1",
      gameDescription:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      time: {
        _seconds: 1721197440,
        _nanoseconds: 0,
      },
      category: "science",
      timeframe: 30,
      teams: [
        {
          name: "blue",
          users: [
            {
              name: "Jainil Sevalia",
              userId: "ep3hh2UBxqbu5zVVA3OI",
            },
            {
              name: "John Doe",
              userId: "yABcNMYDYMjEJBhyKseP",
            },
          ],
          teamId: "zDLfJ5QPRtuQhwh8CWsy",
        },
      ],
      difficulty: "easy",
      id: "8yvSLfKWpKkklv1HGRPR",
    },
    {
      difficulty: "medium",
      gameName: "TEST",
      gameDescription:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      time: {
        _seconds: 1721197440,
        _nanoseconds: 0,
      },
      category: "science",
      timeframe: 60,
      teams: [
        {
          name: "rcb",
          users: [
            {
              name: "Shivam Patel",
              userId: "SsqrV3dlLUAWechMljF0",
            },
          ],
          teamId: "piyAEjC1rXtrlYrL8aqH",
        },
      ],
      id: "AWBl0fltFa97uwYoqsbT",
    },
    {
      difficulty: "medium",
      gameName: "TEST 2222",
      gameDescription:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      time: {
        _seconds: 1721197440,
        _nanoseconds: 0,
      },
      category: "science",
      timeframe: 45,
      teams: [],
      id: "RzZ8TW4aFj4twcTb7OR5",
    },
    {
      difficulty: "medium",
      gameName: "TEST",
      gameDescription:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      time: {
        _seconds: 1721186640,
        _nanoseconds: 0,
      },
      timeframe: 30,
      category: "environment",
      teams: [
        {
          name: "rcb",
          users: [
            {
              name: "Shivam Patel",
              userId: "SsqrV3dlLUAWechMljF0",
            },
          ],
          teamId: "piyAEjC1rXtrlYrL8aqH",
        },
        {
          name: "blue",
          users: [
            {
              name: "Jainil Sevalia",
              userId: "ep3hh2UBxqbu5zVVA3OI",
            },
            {
              name: "John Doe",
              userId: "yABcNMYDYMjEJBhyKseP",
            },
          ],
          teamId: "zDLfJ5QPRtuQhwh8CWsy",
        },
      ],
      id: "SvZRBBbjvLbxXu6tmSzN",
    },
  ];

  const [loading, setLoading] = useState(false);
  const [games, setGames] = useState([]);

  // TODO: DO NOT REMOVE THIS CODE IF ANYONE IS REMOVING COMMENTED CODE
  useEffect(() => {
    (async function () {
      try {
        setLoading(true);
        const { data } = await axios.get(
          "https://aj8bs2zi4e.execute-api.us-east-1.amazonaws.com/dev/games"
        );
        console.log(data.games);
        setGames(data.games);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    })();
  }, []);

  const handleFilter = async ({ category, difficulty, timeframe }) => {
    console.log(category, difficulty, timeframe);
    const queryParams = {};

    if (category) {
      queryParams.category = category;
    }

    if (difficulty) {
      queryParams.difficulty = difficulty;
    }

    if (timeframe) {
      queryParams.timeframe = timeframe;
    }

    const queryString = Object.keys(queryParams)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
      .join("&");

    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://aj8bs2zi4e.execute-api.us-east-1.amazonaws.com/dev/games?${queryString}`
      );

      setLoading(false);
      setGames(data.games);
    } catch {
      setLoading(false);
    }
  };

  return !loading ? (
    games?.length !== 0 ? (
      <div className={styles.browsePage}>
        <div className={styles.container}>
          <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "20px" }}>
            Browse Games
          </Typography>
          <GameFilters handleFilter={handleFilter} />
          <div className={styles.gameList}>
            {games?.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </div>
    ) : (
      <div>No Games Found</div>
    )
  ) : (
    <div className={styles.wrapper}>
      <CircularProgress />
    </div>
  );
};

export default BrowseGamesPage;
