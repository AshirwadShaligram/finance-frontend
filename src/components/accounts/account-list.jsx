"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
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
import AccountForm from "./account-form";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { deleteAccount } from "@/store/slice/accountSlice";

export default function AccountList() {
  const accounts = useSelector((state) => state.accounts.accounts);
  const dispatch = useDispatch();

  const [editingAccount, setEditingAccount] = useState(null);
  const [deletingAccount, setDeletingAccount] = useState(null);

  const handleDelete = () => {
    if (!deletingAccount) return;

    try {
      // Fixed: Use _id instead of id since that's what you're storing
      dispatch(deleteAccount(deletingAccount._id))
        .unwrap()
        .then(() => {
          toast.success("Account Deleted", {
            description: `${deletingAccount.name} has been removed.`,
          });
        })
        .catch((error) => {
          toast.error("Failed to delete account", {
            description: error?.message || "Delete the transactions first.",
          });
        });
    } finally {
      setDeletingAccount(null);
    }
  };

  if (accounts.length === 0) {
    return (
      <div className="text-center p-6 border rounded-lg bg-muted/20">
        <p className="text-muted-foreground">
          No accounts found. Add an account to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {accounts.map((account) => (
        <div
          key={account._id}
          className="flex items-center justify-between p-4 border rounded-lg"
          style={{ borderLeftColor: account.color, borderLeftWidth: "4px" }}
        >
          <div>
            <h4 className="font-medium">{account.name}</h4>
            <p
              className={`text-sm ${
                account.balance < 0 ? "text-red-500" : "text-muted-foreground"
              }`}
            >
              {account.balance}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingAccount(account)}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                // Fixed: Store the account object directly or use consistent property names
                setDeletingAccount({ _id: account._id, name: account.name })
              }
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      ))}

      {editingAccount && (
        <AccountForm
          isOpen={!!editingAccount}
          onClose={() => setEditingAccount(null)}
          accountToEdit={editingAccount}
        />
      )}

      <AlertDialog
        open={!!deletingAccount}
        onOpenChange={(open) => !open && setDeletingAccount(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the account "{deletingAccount?.name}
              ". This action cannot be undone if there are transactions linked
              to this account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
