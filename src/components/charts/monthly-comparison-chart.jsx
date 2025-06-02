"use client";

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
  subDays,
  subMonths,
  parseISO,
  eachWeekOfInterval,
  eachMonthOfInterval,
  eachYearOfInterval,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";
import { formatCurrency } from "@/lib/utils";

export default function MonthlyComparisonChart({ timeframe }) {
  const transactions = useSelector((state) => state.transactions.transactions);

  const endDate = new Date();
  let startDate;
  let intervals;
  let intervalFormatString;
  let getIntervalStart;
  let getIntervalEnd;

  // Set up the intervals based on the timeframe
  if (timeframe === "weekly") {
    startDate = subDays(endDate, 60); // ~8 weeks
    intervals = eachWeekOfInterval({ start: startDate, end: endDate });
    intervalFormatString = "MMM d";
    getIntervalStart = startOfWeek;
    getIntervalEnd = endOfWeek;
  } else if (timeframe === "yearly") {
    startDate = subMonths(endDate, 48); // 4 years
    intervals = eachYearOfInterval({ start: startDate, end: endDate });
    intervalFormatString = "yyyy";
    getIntervalStart = startOfYear;
    getIntervalEnd = endOfYear;
  } else {
    // Default to monthly
    startDate = subMonths(endDate, 11); // 12 months
    intervals = eachMonthOfInterval({ start: startDate, end: endDate });
    intervalFormatString = "MMM yyyy";
    getIntervalStart = startOfMonth;
    getIntervalEnd = endOfMonth;
  }

  // Calculate data for each interval
  const chartData = intervals.map((interval) => {
    const intervalStart = getIntervalStart(interval);
    const intervalEnd = getIntervalEnd(interval);

    // Filter transactions for this interval
    const intervalTransactions = transactions.filter((t) => {
      const date = parseISO(t.date);
      return date >= intervalStart && date <= intervalEnd;
    });

    // Calculate income and expenses
    const income = intervalTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = intervalTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      period: format(interval, intervalFormatString),
      income,
      expenses,
      balance: income - expenses,
    };
  });

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 shadow-md rounded-md border border-border">
          <p className="text-sm font-semibold">{label}</p>
          <div className="mt-2 space-y-1">
            <p className="text-xs flex justify-between gap-4">
              <span className="text-emerald-500">Income:</span>
              <span>{formatCurrency(payload[0].value)}</span>
            </p>
            <p className="text-xs flex justify-between gap-4">
              <span className="text-red-500">Expenses:</span>
              <span>{formatCurrency(payload[1].value)}</span>
            </p>
            <p className="text-xs flex justify-between gap-4 font-medium border-t border-border pt-1 mt-1">
              <span>Balance:</span>
              <span
                className={
                  payload[2].value >= 0 ? "text-emerald-500" : "text-red-500"
                }
              >
                {formatCurrency(payload[2].value)}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#888"
          strokeOpacity={0.2}
        />
        <XAxis dataKey="period" tick={{ fontSize: 12 }} tickMargin={10} />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `$${value}`}
          width={80}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar
          dataKey="income"
          name="Income"
          fill="hsl(var(--chart-1))"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="expenses"
          name="Expenses"
          fill="hsl(var(--chart-3))"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="balance"
          name="Balance"
          fill="hsl(var(--chart-2))"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
