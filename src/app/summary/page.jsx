"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTransactions,
  fetchFinancialSummary,
  clearTransactionError,
  clearSummaryError,
} from "@/store/slice/transactionSlice";
import { fetchCategories } from "@/store/slice/categorySlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Filter, Plus, Search, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import TransactionList from "@/components/transactions/transaction-list";
import TransactionForm from "@/components/transactions/transaction-form";
import { formatCurrency } from "@/lib/utils";
import { fetchAccounts } from "@/store/slice/accountSlice";

export default function SummaryPage() {
  const dispatch = useDispatch();
  const {
    transactions,
    financialSummary,
    loading: transactionsLoading,
    summaryLoading,
    error: transactionsError,
    summaryError,
  } = useSelector((state) => state.transactions);
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSelector((state) => state.categories);

  const { accounts, loading: accountsLoading } = useSelector(
    (state) => state.accounts
  );

  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState(undefined);
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchFinancialSummary());
    dispatch(fetchCategories());
    dispatch(fetchAccounts());
  }, [dispatch]);

  // Calculate totals from financialSummary
  const totalIncome = financialSummary?.totalIncome || 0;
  const totalExpense = financialSummary?.totalExpense || 0;

  // Filter and sort transactions
  const filteredTransactions = transactions.filter((transaction) => {
    // Search query filter
    if (
      searchQuery &&
      !transaction.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Category filter
    if (
      categoryFilter !== "all" &&
      transaction.category?._id !== categoryFilter
    ) {
      return false;
    }

    // Type filter
    if (typeFilter !== "all" && transaction.type !== typeFilter) {
      return false;
    }

    // Date filter
    if (dateFilter) {
      const transactionDate = new Date(transaction.date);
      const filterDate = new Date(dateFilter);

      if (
        transactionDate.getDate() !== filterDate.getDate() ||
        transactionDate.getMonth() !== filterDate.getMonth() ||
        transactionDate.getFullYear() !== filterDate.getFullYear()
      ) {
        return false;
      }
    }

    return true;
  });

  // Sort the filtered transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let aValue, bValue;

    if (sortField === "date") {
      aValue = new Date(a.date).getTime();
      bValue = new Date(b.date).getTime();
    } else if (sortField === "amount") {
      aValue = a.amount;
      bValue = b.amount;
    } else {
      aValue = a.description.toLowerCase();
      bValue = b.description.toLowerCase();
    }

    const direction = sortDirection === "asc" ? 1 : -1;
    return (aValue > bValue ? 1 : -1) * direction;
  });

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setTypeFilter("all");
    setDateFilter(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Transaction Summary</h1>
        <Button onClick={() => setIsAddingTransaction(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Transaction
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Income</CardTitle>
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
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500">
              {formatCurrency(totalExpense)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters and Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Transaction Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFilter ? (
                    format(dateFilter, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateFilter}
                  onSelect={setDateFilter}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSort("date")}
              className="flex items-center gap-2"
            >
              Date
              <ArrowUpDown className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSort("amount")}
              className="flex items-center gap-2"
            >
              Amount
              <ArrowUpDown className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSort("description")}
              className="flex items-center gap-2"
            >
              Description
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>

          <TransactionList
            transactions={sortedTransactions}
            showEmpty
            isLoading={transactionsLoading || categoriesLoading}
          />
        </CardContent>
      </Card>

      <TransactionForm
        isOpen={isAddingTransaction}
        onClose={() => setIsAddingTransaction(false)}
        categories={categories}
        accounts={accounts}
      />
    </div>
  );
}
