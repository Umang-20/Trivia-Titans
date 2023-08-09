import React, { useState, useEffect } from "react";
import {
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Tab,
  Tabs,
  Container,
} from "@mui/material";
import Table from "../../components/Table";
import styles from "./index.module.css";
import Chart from "../../components/Chart";
import { useDispatch, useSelector } from "react-redux";
import { getLeaderboardData } from "../../store/actions/leaderboard";

const LeaderboardPage = () => {
  const { data: fetchedLeaderboardData } = useSelector((state) => state.leaderboard);

  const [leaderboardData, setLeaderboardData] = useState(fetchedLeaderboardData);
  const [timeFrame, setTimeFrame] = useState("all-time");
  const [category, setCategory] = useState("all");
  const [activeTab, setActiveTab] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    setLeaderboardData(fetchedLeaderboardData);
  }, [fetchedLeaderboardData]);

  useEffect(() => {
    // Fetch leaderboard data based on the selected time frame
    fetchLeaderboardData();
  }, [timeFrame, activeTab, category]);

  const fetchLeaderboardData = async () => {
    const bodyData = {
      entity_type: activeTab === 0 ? "team" : "player",
      time_frame: timeFrame,
      category: category,
    };
    await dispatch(getLeaderboardData(bodyData));
  };

  const columns = React.useMemo(
    () => [
      { Header: "Name", accessor: "name" },
      { Header: "Category", accessor: "category" },
      { Header: "Right Answer", accessor: "right_answers" },
      { Header: "Wrong Answer", accessor: "wrong_answers" },
      { Header: "Score", accessor: "score" },
    ],
    []
  );

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const timeFrameOptions = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "all-time", label: "All Time" },
  ];

  const categoryOptions = [
    { value: "all", label: "ALL" },
    { value: "science", label: "Science" },
    { value: "environment", label: "Environment" },
  ];

  return (
    <Container className={styles.container}>
      <Typography variant="h4" align="center" gutterBottom className={styles.heading}>
        Leaderboard
      </Typography>
      <Box className={styles.tabs}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Teams" />
          <Tab label="Individual Players" />
        </Tabs>
      </Box>
      <Box className={styles.filters}>
        <FormControl>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
          >
            {categoryOptions.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="time-frame-label">Time Frame</InputLabel>
          <Select
            labelId="time-frame-label"
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
            label="Time Frame"
          >
            {timeFrameOptions.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Table columns={columns} data={leaderboardData} />
      <Box className={styles.statistics}>
        <Typography variant="h5" align="center" gutterBottom>
          Statistics
        </Typography>
        <Chart data={leaderboardData} />
      </Box>
    </Container>
  );
};

export default LeaderboardPage;
