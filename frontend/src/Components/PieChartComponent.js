import React from "react";
import { Box, Typography } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const PieChartComponent = ({ data, title }) => {
  const chartData = data.map((item) => ({
    name: item.name,
    total: item.percentage ? parseFloat(item.percentage) : parseFloat(item.total),
  }));
  return (
    <Box>
      <Typography variant="h6">{title}</Typography>
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
                fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default PieChartComponent;
