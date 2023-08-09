import React from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
} from "recharts";

import Typography from "@mui/material/Typography";
import classes from "./index.module.css";

const ChartComponent = ({ data }) => {
  // Get the top 3 entries
  const topEntries = data.slice(0, 3);

  // Prepare the data for the chart
  const chartData = topEntries.map((entry) => ({
    name: entry.name,
    score: entry.score,
    right_answers: entry.right_answers,
    wrong_answers: entry.wrong_answers,
  }));

  return (
    <div className={classes.chartContainer}>
      {data.length > 0 ? (
        <>
          <BarChart width={600} height={500} data={chartData}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" fill="#8884d8">
              <LabelList dataKey="score" position="insideTop" fill="#fff" />
            </Bar>
            <Bar dataKey="right_answers" fill="#82ca9d">
              <LabelList
                dataKey="right_answers"
                position="insideTop"
                fill="#fff"
              />
            </Bar>
            <Bar dataKey="wrong_answers" fill="#ffc658">
              <LabelList
                dataKey="wrong_answers"
                position="insideTop"
                fill="#fff"
              />
            </Bar>
          </BarChart>
          <Typography
            variant="h6"
            align="center"
            className={classes.chartTitle}
          >
            Top 3 {topEntries[0].entity_type === "team" ? "Teams" : "Players"}
          </Typography>
        </>
      ) : (
        <Typography variant="h6" align="center" className={classes.noDataText}>
          No Data Found
        </Typography>
      )}
    </div>
  );
};

export default ChartComponent;
