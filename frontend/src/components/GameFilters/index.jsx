import { Box, Button, Grid, Select, MenuItem, TextField } from "@mui/material";
import React, { useState } from "react";

const GameFilters = ({ handleFilter }) => {
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [timeframe, setTimeframe] = useState("");

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
  };

  const handleTimeframeChange = (e) => {
    setTimeframe(e.target.value);
  };

  const handleApplyFilter = () => {
    const filters = {
      category,
      difficulty,
      timeframe,
    };
    handleFilter(filters);
  };

  return (
    <Box sx={{ marginBottom: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Category"
            variant="outlined"
            size="small"
            fullWidth
            value={category}
            onChange={handleCategoryChange}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Select
            label="Difficulty"
            variant="outlined"
            size="small"
            fullWidth
            value={difficulty}
            onChange={handleDifficultyChange}
          >
            <MenuItem value="">Any</MenuItem>
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Timeframe"
            variant="outlined"
            size="small"
            fullWidth
            value={timeframe}
            onChange={handleTimeframeChange}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box sx={{ minWidth: "fit-content" }}>
            <Button variant="outlined" onClick={handleApplyFilter}>
              Apply Filters
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GameFilters;
