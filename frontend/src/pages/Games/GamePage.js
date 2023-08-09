/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import axios from "axios";

const GamePage = () => {
  const initialGameData = {
    category: "",
    difficulty: "",
    gameDescription: "",
    gameName: "",
    time: "",
    timeframe: "",
  };

  const [games, setGames] = useState([]);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [gameDescription, setGameDescription] = useState("");
  const [gameName, setGameName] = useState("");
  const [time, setTime] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [editGameId, setEditGameId] = useState(null);
  const [editGameData, setEditGameData] = useState(initialGameData);
  const [disableOtherActions, setDisableOtherActions] = useState(false);

  const fetchGames = async () => {
    const res = await axios.get("https://1lf28gvd9b.execute-api.us-east-1.amazonaws.com/default/games");
    setGames(res.data);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const addGame = async () => {
    if (!category || !difficulty || !gameDescription || !gameName || !time || !timeframe) {
      alert("Please fill out all fields before submitting");
      return;
    }
    setDisableOtherActions(true);
    await axios.post("https://1lf28gvd9b.execute-api.us-east-1.amazonaws.com/default/games", {
      category,
      difficulty,
      gameDescription,
      gameName,
      time,
      timeframe,
    });
    setDisableOtherActions(false);
    fetchGames();
    resetFields();
  };

  const deleteGame = async (gameId) => {
    await axios.delete(`https://1lf28gvd9b.execute-api.us-east-1.amazonaws.com/default/games/${gameId}`);
    fetchGames();
  };

  const updateGame = async () => {
    setDisableOtherActions(true);
    const updatedGameData = {
      gameName: editGameData.gameName,
      category: editGameData.category,
      difficulty: editGameData.difficulty,
      gameDescription: editGameData.gameDescription,
      time: editGameData.time,
      timeframe: editGameData.timeframe,
    };
    await axios.put(`https://1lf28gvd9b.execute-api.us-east-1.amazonaws.com/default/games/${editGameId}`, updatedGameData);
    setDisableOtherActions(false);
    fetchGames();
    setEditGameId(null);
  };

  const handleUpdateClick = (game) => {
    setEditGameData(game);
    setEditGameId(game.id);
    setDisableOtherActions(true);
  };

  const resetFields = () => {
    setCategory("");
    setDifficulty("");
    setGameDescription("");
    setGameName("");
    setTime("");
    setTimeframe("");
  };

  return (
    <div>
      <h1>Game Manager</h1>
      <input
        type="text"
        value={gameName}
        onChange={(e) => setGameName(e.target.value)}
        placeholder="Enter Game Name"
      />
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Enter Category"
      />
      <input
        type="text"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        placeholder="Enter Difficulty"
      />
      <input
        type="text"
        value={gameDescription}
        onChange={(e) => setGameDescription(e.target.value)}
        placeholder="Enter Game Description"
      />
      <input
        type="text"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        placeholder="Enter Time"
      />
      <input
        type="number"
        value={timeframe}
        onChange={(e) => setTimeframe(e.target.value)}
        placeholder="Enter Timeframe"
      />
      <button onClick={addGame} disabled={disableOtherActions}>
        Add Game
      </button>
      <h1>Game List</h1>
      {games.map((game) => (
        <div key={game.id}>
          <h3>{game.gameName}</h3>
          <p>
            {game.category} - {game.difficulty}
          </p>
          <p>{game.gameDescription}</p>
          <p>
            Time: {game.time} | Timeframe: {game.timeframe}
          </p>
          <button onClick={() => handleUpdateClick(game)} disabled={disableOtherActions}>
            Update
          </button>
          <button onClick={() => deleteGame(game.id)} disabled={disableOtherActions}>
            Delete
          </button>
          {editGameId === game.id && (
            <div>
              <input
                type="text"
                value={editGameData.gameName}
                onChange={(e) => setEditGameData({ ...editGameData, gameName: e.target.value })}
                placeholder="Enter Game Name"
              />
              <input
                type="text"
                value={editGameData.category}
                onChange={(e) => setEditGameData({ ...editGameData, category: e.target.value })}
                placeholder="Enter Category"
              />
              <input
                type="text"
                value={editGameData.difficulty}
                onChange={(e) => setEditGameData({ ...editGameData, difficulty: e.target.value })}
                placeholder="Enter Difficulty"
              />
              <input
                type="text"
                value={editGameData.gameDescription}
                onChange={(e) => setEditGameData({ ...editGameData, gameDescription: e.target.value })}
                placeholder="Enter Game Description"
              />
              <input
                type="text"
                value={editGameData.time}
                onChange={(e) => setEditGameData({ ...editGameData, time: e.target.value })}
                placeholder="Enter Time"
              />
              <input
                type="number"
                value={editGameData.timeframe}
                onChange={(e) => setEditGameData({ ...editGameData, timeframe: e.target.value })}
                placeholder="Enter Timeframe"
              />
              <button onClick={updateGame}>Save Changes</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GamePage;
