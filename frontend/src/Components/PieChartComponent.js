import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const PieChartComponent = ({ data, title, COLORS }) => {
  const chartData = data.map((item) => ({
    name: item.name,
    total: item.percentage
      ? parseFloat(item.percentage)
      : parseFloat(item.total),
  }));
  return (
    <Paper elevation={3}>
      <Box padding={2}>
        <Typography variant="h6">{title}</Typography>
        {data.length === 0 ? (
          <Typography variant="body1">No data available.</Typography>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="total"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Paper>
  );
};

export default PieChartComponent;
