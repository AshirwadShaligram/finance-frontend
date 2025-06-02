"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTransaction } from "@/store/slice/transactionSlice";
import { Button } from "@/components/ui/button";
import { BadgePlus, Calendar, Edit, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatCurrency, formatDate } from "@/lib/utils";
import TransactionForm from "./transaction-form";
import Link from "next/link";

export default function TransactionList({
  transactions,
  showViewAll = false,
  showEmpty = false,
}) {
  const dispatch = useDispatch();
  const [deletingTransactionId, setDeletingTransactionId] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Redux selectors
  const { categories } = useSelector((state) => state.categories);
  const { accounts } = useSelector((state) => state.accounts);
  const { loading } = useSelector((state) => state.transactions);

  // Helper functions to get category and account by ID
  const getCategoryById = (categoryId) => {
    return categories.find((category) => category._id === categoryId);
  };

  const getAccountById = (accountId) => {
    return accounts.find((account) => account._id === accountId);
  };

  const handleDeleteTransaction = async () => {
    if (deletingTransactionId) {
      try {
        await dispatch(deleteTransaction(deletingTransactionId)).unwrap();
        setDeletingTransactionId(null);
        // Optionally refresh financial summary here
        // dispatch(fetchFinancialSummary());
      } catch (error) {
        console.error("Failed to delete transaction:", error);
        // Handle error (show toast, etc.)
      }
    }
  };

  if (transactions.length === 0 && showEmpty) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/20">
        <p className="text-muted-foreground mb-4">No transactions found.</p>
        <Button variant="outline">
          <BadgePlus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-1">
        {transactions.map((transaction) => {
          const category = getCategoryById(
            transaction.category._id || transaction.category
          );
          const account = getAccountById(
            transaction.account._id || transaction.account
          );

          return (
            <div key={transaction._id || transaction.id} className="group">
              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div
                    className="w-2 h-8 rounded-full"
                    style={{ backgroundColor: category?.color || "#6b7280" }}
                  ></div>
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="flex items-center text-xs text-muted-foreground gap-2">
                      <span>{category?.name || "Unknown Category"}</span>
                      <span>•</span>
                      <span>{account?.name || "Unknown Account"}</span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(transaction.date)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className={`text-right ${
                      transaction.type === "expense"
                        ? "text-red-500"
                        : "text-emerald-500"
                    }`}
                  >
                    {transaction.type === "expense" ? "-" : "+"}
                    {formatCurrency(transaction.amount)}
                  </div>

                  <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingTransaction(transaction)}
                      disabled={loading}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setDeletingTransactionId(
                          transaction._id || transaction.id
                        )
                      }
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              </div>
              <Separator />
            </div>
          );
        })}
      </div>

      {showViewAll && (
        <div className="mt-4 text-center">
          <Link href="/summary" passHref>
            <Button variant="outline">View All Transactions</Button>
          </Link>
        </div>
      )}

      {/* Edit Transaction Modal */}
      {editingTransaction && (
        <TransactionForm
          isOpen={!!editingTransaction}
          onClose={() => setEditingTransaction(null)}
          transactionToEdit={editingTransaction}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingTransactionId}
        onOpenChange={(open) => !open && setDeletingTransactionId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this transaction and update your
              account balance accordingly. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTransaction}
              disabled={loading}
              className="bg-destructive text-destructive-foreground"
            >
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
