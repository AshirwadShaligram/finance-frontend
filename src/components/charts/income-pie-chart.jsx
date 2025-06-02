"use client";

import { useSelector } from "react-redux";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

export default function IncomePieChart() {
  const transactions = useSelector((state) => state.transactions.transactions);
  const categories = useSelector((state) => state.categories.categories);

  // Filter income transactions
  const incomeTransactions = transactions.filter((t) => t.type === "income");

  // Group by category and sum amounts
  const categoryAmounts = {};

  incomeTransactions.forEach((transaction) => {
    // Transaction has a category object with _id
    const categoryId = transaction.category?._id;
    if (categoryId) {
      if (!categoryAmounts[categoryId]) {
        categoryAmounts[categoryId] = 0;
      }
      categoryAmounts[categoryId] += transaction.amount;
    }
  });

  // Prepare data for pie chart
  const chartData = Object.entries(categoryAmounts)
    .map(([categoryId, amount]) => {
      // Find category by _id or use the category from transaction directly
      const category =
        categories.find((c) => c._id === categoryId) ||
        incomeTransactions.find((t) => t.category?._id === categoryId)
          ?.category;
      return {
        name: category?.name || "Unknown",
        value: amount,
        color: category?.color || "#888888",
      };
    })
    .filter((item) => item.value > 0) // Filter out zero amounts
    .sort((a, b) => b.value - a.value);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const total = chartData.reduce((sum, item) => sum + item.value, 0);
      return (
        <div className="bg-card p-3 shadow-md rounded-md border border-border">
          <p className="font-semibold">{payload[0].name}</p>
          <p>{formatCurrency(payload[0].value)}</p>
          <p className="text-xs text-muted-foreground">
            {((payload[0].value / total) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
        <p>No income data available</p>
        <p className="text-xs mt-2">
          Transactions: {incomeTransactions.length}, Categories:{" "}
          {categories.length}
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          innerRadius={50}
          labelLine={false}
          label={({ name, percent }) =>
            `${name} (${(percent * 100).toFixed(0)}%)`
          }
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
