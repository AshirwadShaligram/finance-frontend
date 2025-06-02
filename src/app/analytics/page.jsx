"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart3, PieChart, TrendingUp } from "lucide-react";
import ExpensePieChart from "@/components/charts/expense-pie-chart";
import IncomePieChart from "@/components/charts/income-pie-chart";
import MonthlyComparisonChart from "@/components/charts/monthly-comparison-chart";
import CategorySpendingChart from "@/components/charts/category-spending-chart";
import { formatCurrency } from "@/lib/utils";

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState("monthly");
  const transactions = useSelector((state) => state.transactions.transactions);
  const financialSummary = useSelector(
    (state) => state.transactions.financialSummary
  );

  // Calculate financial metrics from Redux state
  const totalIncome = financialSummary.totalIncome || 0;
  const totalExpense = financialSummary.totalExpense || 0;
  const netBalance = financialSummary.netBalance || 0;
  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Financial Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Income</CardTitle>
            <CardDescription>Money coming in</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-500">
              {formatCurrency(totalIncome)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Expenses</CardTitle>
            <CardDescription>Money going out</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500">
              {formatCurrency(totalExpense)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Savings Rate</CardTitle>
            <CardDescription>Percentage of income saved</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">
              {savingsRate.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Income vs Expenses
            </CardTitle>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="h-80">
          <MonthlyComparisonChart timeframe={timeframe} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Income Distribution
            </CardTitle>
            <CardDescription>Breakdown by category</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <IncomePieChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Expense Distribution
            </CardTitle>
            <CardDescription>Breakdown by category</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ExpensePieChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Category Spending Trends
          </CardTitle>
          <CardDescription>
            How your spending has changed over time
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <CategorySpendingChart />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detailed Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="spending">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="spending">Spending Habits</TabsTrigger>
              <TabsTrigger value="trends">Trends Over Time</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>
            <TabsContent value="spending" className="p-4">
              <h3 className="text-lg font-medium mb-2">Spending Analysis</h3>
              <p className="text-muted-foreground mb-4">
                Based on your transaction history, your top spending categories
                are:
              </p>
              <ul className="space-y-2">
                <li className="flex justify-between items-center border-b pb-2">
                  <span>Housing</span>
                  <span className="font-medium">34%</span>
                </li>
                <li className="flex justify-between items-center border-b pb-2">
                  <span>Food</span>
                  <span className="font-medium">22%</span>
                </li>
                <li className="flex justify-between items-center border-b pb-2">
                  <span>Transportation</span>
                  <span className="font-medium">15%</span>
                </li>
                <li className="flex justify-between items-center border-b pb-2">
                  <span>Entertainment</span>
                  <span className="font-medium">12%</span>
                </li>
                <li className="flex justify-between items-center pb-2">
                  <span>Other</span>
                  <span className="font-medium">17%</span>
                </li>
              </ul>
            </TabsContent>
            <TabsContent value="trends" className="p-4">
              <h3 className="text-lg font-medium mb-2">Financial Trends</h3>
              <p className="text-muted-foreground mb-4">
                Your spending patterns show:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-emerald-500 mt-1"></div>
                  <div>
                    <p className="font-medium">Increasing Savings Rate</p>
                    <p className="text-sm text-muted-foreground">
                      Your savings rate has improved 5% compared to last month.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-amber-500 mt-1"></div>
                  <div>
                    <p className="font-medium">Weekend Spending Spikes</p>
                    <p className="text-sm text-muted-foreground">
                      You tend to spend 45% more on weekends than weekdays.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-blue-500 mt-1"></div>
                  <div>
                    <p className="font-medium">Consistent Income Pattern</p>
                    <p className="text-sm text-muted-foreground">
                      Your income has been stable with minor fluctuations of
                      3-4%.
                    </p>
                  </div>
                </li>
              </ul>
            </TabsContent>
            <TabsContent value="recommendations" className="p-4">
              <h3 className="text-lg font-medium mb-2">
                Savings Opportunities
              </h3>
              <p className="text-muted-foreground mb-4">
                Based on your financial data, here are some recommendations:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-emerald-500 mt-1"></div>
                  <div>
                    <p className="font-medium">Reduce Food Expenses</p>
                    <p className="text-sm text-muted-foreground">
                      Your food spending is 15% higher than average. Consider
                      meal planning to reduce costs.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-emerald-500 mt-1"></div>
                  <div>
                    <p className="font-medium">Set Up Emergency Fund</p>
                    <p className="text-sm text-muted-foreground">
                      Aim to save 3-6 months of expenses in an easily accessible
                      account.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-emerald-500 mt-1"></div>
                  <div>
                    <p className="font-medium">
                      Increase Investment Contributions
                    </p>
                    <p className="text-sm text-muted-foreground">
                      With your current savings rate, you could increase
                      investments by 5%.
                    </p>
                  </div>
                </li>
              </ul>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
