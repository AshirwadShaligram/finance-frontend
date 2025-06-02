"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccounts } from "@/store/slice/accountSlice";
import { fetchCategories } from "@/store/slice/categorySlice";
import {
  fetchTransactions,
  fetchFinancialSummary,
} from "@/store/slice/transactionSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  ArrowUp,
  Plus,
  TrendingUp,
  Wallet,
  CreditCard,
} from "lucide-react";
import TransactionList from "@/components/transactions/transaction-list";
import TransactionForm from "@/components/transactions/transaction-form";
import BalanceChart from "@/components/charts/balance-chart";
import AccountCards from "@/components/accounts/account-cards";
import { formatCurrency } from "@/lib/utils";

export default function Home() {
  const dispatch = useDispatch();
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [transactionType, setTransactionType] = useState("expense");

  // Redux selectors
  const {
    transactions,
    financialSummary,
    loading: transactionsLoading,
  } = useSelector((state) => state.transactions);
  const { accounts, loading: accountsLoading } = useSelector(
    (state) => state.accounts
  );
  const { categories, loading: categoriesLoading } = useSelector(
    (state) => state.categories
  );

  // Extract financial data
  const { totalIncome, totalExpense, netBalance } = financialSummary;

  // Get recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchCategories());
    dispatch(fetchTransactions());
    dispatch(fetchFinancialSummary());
  }, [dispatch]);

  const openTransactionForm = (type) => {
    setTransactionType(type);
    setIsAddingTransaction(true);
  };

  const isLoading = transactionsLoading || accountsLoading || categoriesLoading;

  // logs
  // console.log("Home page Accounts:", accounts);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Credit Card Balance Component */}
        <div className="md:col-span-2">
          <Card className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white overflow-hidden relative h-full">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />
            <CardHeader className="relative">
              <CardTitle className="text-2xl flex items-center gap-2">
                <CreditCard className="h-6 w-6" />
                Total Balance
              </CardTitle>
              <CardDescription className="text-white/80">
                Your current net worth
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-4xl font-bold mb-4">
                {formatCurrency(netBalance)}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/80 text-sm">Income</p>
                  <p className="text-xl font-semibold">
                    +{formatCurrency(totalIncome)}
                  </p>
                </div>
                <div>
                  <p className="text-white/80 text-sm">Expenses</p>
                  <p className="text-xl font-semibold">
                    -{formatCurrency(totalExpense)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Card */}
        <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>Manage your finances</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button
              onClick={() => openTransactionForm("income")}
              variant="outline"
              className="justify-start w-full border-emerald-500/20 hover:bg-emerald-500/10 hover:text-emerald-600 shadow-sm"
            >
              <ArrowUp className="mr-2 h-4 w-4 text-emerald-500" />
              Add Income
            </Button>
            <Button
              onClick={() => openTransactionForm("expense")}
              variant="outline"
              className="justify-start w-full border-red-500/20 hover:bg-red-500/10 hover:text-red-600 shadow-sm"
            >
              <ArrowDown className="mr-2 h-4 w-4 text-red-500" />
              Add Expense
            </Button>
          </CardContent>
        </Card>

        {/* Net Balance Card */}
        <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Net Balance
            </CardTitle>
            <CardDescription>Your current balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(netBalance)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Income Card */}
        <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowUp className="h-5 w-5 text-emerald-500" />
              Income
            </CardTitle>
            <CardDescription>Total earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">
              {formatCurrency(totalIncome)}
            </div>
          </CardContent>
        </Card>

        {/* Expense Card */}
        <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowDown className="h-5 w-5 text-red-500" />
              Expenses
            </CardTitle>
            <CardDescription>Total spending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {formatCurrency(totalExpense)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accounts Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Your Accounts
        </h2>
        <AccountCards />
      </section>

      {/* Balance Chart */}
      <Card className="bg-card shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Financial Overview
          </CardTitle>
          <CardDescription>Your balance trend over time</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <BalanceChart />
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
        <TransactionList transactions={recentTransactions} showViewAll />
      </section>

      {/* Transaction Form Dialog */}
      <TransactionForm
        isOpen={isAddingTransaction}
        onClose={() => setIsAddingTransaction(false)}
        defaultType={transactionType}
        categories={categories}
        accounts={accounts}
      />
    </div>
  );
}
