"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createTransaction,
  updateTransaction,
} from "@/store/slice/transactionSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function TransactionForm({
  isOpen,
  onClose,
  defaultType = "expense",
  transactionToEdit,
  categories = [],
  accounts = [],
}) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.transactions);

  const [formData, setFormData] = useState({
    amount: transactionToEdit?.amount?.toString() || "",
    description: transactionToEdit?.description || "",
    date: transactionToEdit ? new Date(transactionToEdit.date) : new Date(),
    type: transactionToEdit?.type || defaultType,
    categoryId: transactionToEdit?.categoryId || "",
    accountId: transactionToEdit?.accountId || "",
  });

  // Reset form when transactionToEdit changes
  useEffect(() => {
    if (transactionToEdit) {
      setFormData({
        amount: transactionToEdit.amount?.toString() || "",
        description: transactionToEdit.description || "",
        date: new Date(transactionToEdit.date),
        type: transactionToEdit.type || defaultType,
        categoryId: transactionToEdit.categoryId || "",
        accountId: transactionToEdit.accountId || "",
      });
    } else {
      resetForm();
    }
  }, [transactionToEdit, defaultType]);

  // Filter categories based on transaction type
  const filteredCategories = categories.filter(
    (category) => category.type === formData.type
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTypeChange = (value) => {
    setFormData({
      ...formData,
      type: value,
      // Reset category when type changes
      categoryId: "",
    });
  };

  const handleDateChange = (date) => {
    if (date) {
      setFormData({
        ...formData,
        date,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🚀 Form submission started");
    console.log("📋 Form data:", formData);
    console.log("🔧 Environment URL:", process.env.NEXT_PUBLIC_BACKEND_URL);

    try {
      if (!formData.categoryId) {
        throw new Error("Please select a category");
      }

      if (!formData.accountId) {
        throw new Error("Please select an account");
      }

      const transactionData = {
        amount: parseFloat(formData.amount),
        description: formData.description,
        date: formData.date.toISOString(),
        type: formData.type,
        categoryId: formData.categoryId,
        accountId: formData.accountId,
      };

      console.log("📦 Transaction data to be sent:", transactionData);

      if (transactionToEdit) {
        console.log("✏️ Updating existing transaction");
        const resultAction = await dispatch(
          updateTransaction({
            id: transactionToEdit._id || transactionToEdit.id,
            transactionData,
          })
        );

        console.log("📤 Update result:", resultAction);

        if (updateTransaction.fulfilled.match(resultAction)) {
          toast.success("Transaction Updated", {
            description: "Your transaction has been updated successfully.",
          });
          resetForm();
          onClose();
        } else {
          console.error("❌ Update failed:", resultAction);
          throw new Error(
            resultAction.payload || "Failed to update transaction"
          );
        }
      } else {
        console.log("➕ Creating new transaction");
        const resultAction = await dispatch(createTransaction(transactionData));

        console.log("📤 Create result:", resultAction);

        if (createTransaction.fulfilled.match(resultAction)) {
          toast.success("Transaction Added", {
            description: "Your transaction has been recorded successfully.",
          });
          resetForm();
          onClose();
        } else {
          console.error("❌ Create failed:", resultAction);
          console.error("❌ Error payload:", resultAction.payload);
          console.error("❌ Error type:", resultAction.type);
          throw new Error(
            resultAction.payload || "Failed to create transaction"
          );
        }
      }
    } catch (error) {
      console.error("💥 Form submission error:", error);
      toast.error("Error", {
        description: error.message || "Something went wrong",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      amount: "",
      description: "",
      date: new Date(),
      type: defaultType,
      categoryId: "",
      accountId: "",
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Debug logging
  useEffect(() => {
    console.log("📊 Categories in form:", categories);
    console.log("🏦 Accounts in form:", accounts);
    console.log("🔧 Backend URL:", process.env.NEXT_PUBLIC_BACKEND_URL);
  }, [categories, accounts]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {transactionToEdit
              ? "Edit Transaction"
              : formData.type === "income"
              ? "Add Income"
              : "Add Expense"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="type">Transaction Type</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={handleTypeChange}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="income" id="income" />
                <Label htmlFor="income" className="font-normal cursor-pointer">
                  Income
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="expense" />
                <Label htmlFor="expense" className="font-normal cursor-pointer">
                  Expense
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              required
              className="text-right"
            />
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What was this for?"
              required
            />
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) =>
                setFormData({ ...formData, categoryId: value })
              }
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No categories available
                  </SelectItem>
                ) : (
                  filteredCategories.map((category) => (
                    <SelectItem
                      key={category.id || category._id}
                      value={category.id || category._id}
                    >
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="account">Account</Label>
            <Select
              value={formData.accountId}
              onValueChange={(value) =>
                setFormData({ ...formData, accountId: value })
              }
            >
              <SelectTrigger id="account">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No accounts available
                  </SelectItem>
                ) : (
                  accounts.map((account) => (
                    <SelectItem
                      key={account.id || account._id}
                      value={account.id || account._id}
                    >
                      {account.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  id="date"
                  type="button"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? (
                    format(formData.date, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : transactionToEdit
                ? "Save Changes"
                : "Add Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
