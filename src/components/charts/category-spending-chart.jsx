"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  format,
  parseISO,
  eachMonthOfInterval,
  startOfMonth,
  endOfMonth,
  subMonths,
} from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";

export default function CategorySpendingChart() {
  const transactions = useSelector((state) => state.transactions.transactions);
  const categories = useSelector((state) => state.categories.categories);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Get expense categories
  const expenseCategories = categories.filter((c) => c.type === "expense");

  // Calculate total spent in each category to determine top categories
  const categoryTotals = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const categoryId = t.category?._id;
      if (categoryId) {
        if (!categoryTotals[categoryId]) {
          categoryTotals[categoryId] = 0;
        }
        categoryTotals[categoryId] += t.amount;
      }
    });

  // If no categories are selected, use the top 5 by amount
  let categoriesToShow = [];

  if (selectedCategories.length > 0) {
    categoriesToShow = expenseCategories.filter((c) =>
      selectedCategories.includes(c._id)
    );
  } else {
    // Get top 5 categories by amount
    const topCategoryIds = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id]) => id);

    categoriesToShow = expenseCategories.filter((c) =>
      topCategoryIds.includes(c._id)
    );
  }

  // Generate monthly intervals for the last 6 months
  const endDate = new Date();
  const startDate = subMonths(endDate, 5); // 6 months total
  const monthIntervals = eachMonthOfInterval({
    start: startDate,
    end: endDate,
  });

  // Prepare data for the chart
  const chartData = monthIntervals.map((month) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const monthLabel = format(month, "MMM yyyy");

    // Base data object with month label
    const dataPoint = { month: monthLabel };

    // Calculate total for each category in this month
    categoriesToShow.forEach((category) => {
      const categoryId = category._id;
      const categoryTotal = transactions
        .filter((t) => {
          const transactionCategoryId = t.category?._id;
          return (
            t.type === "expense" &&
            transactionCategoryId === categoryId &&
            parseISO(t.date) >= monthStart &&
            parseISO(t.date) <= monthEnd
          );
        })
        .reduce((sum, t) => sum + t.amount, 0);

      dataPoint[categoryId] = categoryTotal;
    });

    return dataPoint;
  });

  // Handle category selection
  const handleCategoryChange = (value) => {
    if (value === "all") {
      setSelectedCategories(expenseCategories.map((c) => c._id));
    } else if (value === "top5") {
      setSelectedCategories([]);
    } else {
      const newSelection = [...selectedCategories];
      const index = newSelection.indexOf(value);

      if (index === -1) {
        // Add category if not already selected
        newSelection.push(value);
      } else {
        // Remove category if already selected
        newSelection.splice(index, 1);
      }

      setSelectedCategories(newSelection);
    }
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 shadow-md rounded-md border border-border">
          <p className="text-sm font-semibold">{label}</p>
          <div className="mt-2 space-y-1">
            {payload.map((entry, index) => {
              const category =
                categories.find((c) => c._id === entry.dataKey) ||
                categoriesToShow.find((c) => c._id === entry.dataKey);
              return (
                <p key={index} className="text-xs flex justify-between gap-4">
                  <span style={{ color: entry.fill }}>{category?.name}:</span>
                  <span>{formatCurrency(entry.value)}</span>
                </p>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full w-full">
      <div className="mb-4 flex justify-end">
        <Select
          onValueChange={handleCategoryChange}
          value={selectedCategories.length === 0 ? "top5" : "custom"}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="top5">Top 5 Categories</SelectItem>
            {expenseCategories.map((category) => (
              <SelectItem key={category._id} value={category._id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {categoriesToShow.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
          <p>No expense categories found</p>
          <p className="text-xs mt-2">
            Categories: {categories.length}, Expense Categories:{" "}
            {expenseCategories.length}
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#888"
              strokeOpacity={0.2}
            />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} tickMargin={10} />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => {
                const category =
                  categories.find((c) => c._id === value) ||
                  categoriesToShow.find((c) => c._id === value);
                return category?.name || value;
              }}
            />

            {categoriesToShow.map((category) => {
              const categoryId = category._id;
              return (
                <Bar
                  key={categoryId}
                  dataKey={categoryId}
                  name={categoryId}
                  fill={category.color}
                  radius={[4, 4, 0, 0]}
                />
              );
            })}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
