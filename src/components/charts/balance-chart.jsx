"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { format, subDays, eachDayOfInterval, parseISO } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BalanceChart() {
  const [period, setPeriod] = useState("30");

  // Redux selector
  const { transactions, loading } = useSelector((state) => state.transactions);

  // Get date range
  const endDate = new Date();
  const startDate = subDays(endDate, parseInt(period));

  // Generate all days in the interval
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Sort transactions by date
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Calculate balance over time
  const balanceData = days.map((day) => {
    const dayStr = format(day, "yyyy-MM-dd");
    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);

    // Get all transactions up to this day
    const relevantTransactions = sortedTransactions.filter(
      (t) => new Date(t.date) <= dayEnd
    );

    // Calculate balance
    let balance = 0;
    relevantTransactions.forEach((t) => {
      if (t.type === "income") {
        balance += t.amount;
      } else {
        balance -= t.amount;
      }
    });

    // Tally income and expenses for this specific day
    const dayTransactions = sortedTransactions.filter(
      (t) => format(parseISO(t.date), "yyyy-MM-dd") === dayStr
    );

    const dayIncome = dayTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const dayExpense = dayTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      date: dayStr,
      formattedDate: format(day, "MMM d"),
      balance,
      income: dayIncome,
      expense: dayExpense,
    };
  });

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">
            No transaction data available
          </p>
          <p className="text-sm text-muted-foreground">
            Add some transactions to see your balance chart
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div className="mb-4 flex justify-end">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={balanceData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#888"
            strokeOpacity={0.2}
          />
          <XAxis
            dataKey="formattedDate"
            tick={{ fontSize: 12 }}
            tickMargin={10}
            minTickGap={15}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `₹${value}`}
            width={80}
          />
          <Tooltip
            formatter={(value, name) => {
              const formattedValue = `₹${Number(value).toFixed(2)}`;
              let label = "";
              switch (name) {
                case "balance":
                  label = "Balance";
                  break;
                case "income":
                  label = "Income";
                  break;
                case "expense":
                  label = "Expense";
                  break;
                default:
                  label = name;
              }
              return [formattedValue, label];
            }}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
            name="Balance"
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            dot={false}
            name="Income"
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="hsl(var(--chart-3))"
            strokeWidth={2}
            dot={false}
            name="Expense"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
