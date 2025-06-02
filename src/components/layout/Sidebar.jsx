"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  BarChart3,
  FileText,
  User,
  ChevronLeft,
  ChevronRight,
  IndianRupee,
  PiggyBank,
  Menu,
  X,
} from "lucide-react";
import TransactionForm from "@/components/transactions/transaction-form";
import { fetchAccounts } from "@/store/slice/accountSlice";
import { fetchCategories } from "@/store/slice/categorySlice";
import { fetchTransactions } from "@/store/slice/transactionSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const dispatch = useDispatch();

  const { accounts, loading: accountsLoading } = useSelector(
    (state) => state.accounts
  );
  const { categories, loading: categoriesLoading } = useSelector(
    (state) => state.categories
  );

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleAddTransaction = () => {
    setIsAddingTransaction(true);
    // Close mobile sidebar if open
    if (mobileOpen) setMobileOpen(false);
  };

  const routes = [
    { name: "Home", path: "/", icon: Home },
    { name: "Summary", path: "/summary", icon: FileText },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
    { name: "My Profile", path: "/my-profile", icon: User },
  ];

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchCategories());
    dispatch(fetchTransactions());
  }, [dispatch]);

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleMobileSidebar}
      >
        {mobileOpen ? <X /> : <Menu />}
      </Button>

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-all duration-200 md:hidden",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={toggleMobileSidebar}
      />

      <aside
        className={cn(
          "bg-card fixed md:relative z-40 flex h-full flex-col border-r transition-all duration-300 ease-in-out",
          expanded ? "w-64" : "w-[70px]",
          mobileOpen ? "left-0" : "-left-full md:left-0"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 py-4">
          <div
            className={cn(
              "flex items-center gap-2 overflow-hidden transition-all duration-300",
              expanded ? "w-auto opacity-100" : "w-0 opacity-0"
            )}
          >
            <PiggyBank className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">FinTrack</span>
          </div>
          {!expanded && <PiggyBank className="h-6 w-6 mx-auto text-primary" />}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            onClick={toggleSidebar}
          >
            {expanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="flex flex-col gap-1 px-2">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
                  pathname === route.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <route.icon className="h-5 w-5 shrink-0" />
                <span
                  className={cn(
                    "text-sm font-medium transition-all duration-300",
                    expanded ? "opacity-100" : "opacity-0 w-0 hidden"
                  )}
                >
                  {route.name}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4">
          <Button
            className={cn(
              "w-full justify-start gap-2",
              !expanded && "w-10 p-0 justify-center"
            )}
            onClick={handleAddTransaction}
          >
            <IndianRupee className="h-5 w-5 shrink-0" />
            <span
              className={cn(
                "transition-all duration-300",
                expanded ? "opacity-100" : "opacity-0 w-0 hidden"
              )}
            >
              Add Transaction
            </span>
          </Button>
        </div>
      </aside>

      {/* Transaction Form */}
      <TransactionForm
        isOpen={isAddingTransaction}
        onClose={() => setIsAddingTransaction(false)}
        categories={categories}
        accounts={accounts}
      />
    </>
  );
}
