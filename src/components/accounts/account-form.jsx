"use client";

import { useState } from "react";
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
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { createAccount, updateAccount } from "@/store/slice/accountSlice";

export default function AccountForm({ isOpen, onClose, accountToEdit }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: accountToEdit?.name || "",
    balance: accountToEdit?.balance?.toString() || "0",
    color: accountToEdit?.color || "#3b82f6",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const accountData = {
        name: formData.name,
        balance: parseFloat(formData.balance),
        color: formData.color,
      };

      if (accountToEdit) {
        await dispatch(
          updateAccount({ id: accountToEdit._id, accountData })
        ).unwrap();
        toast.success("Account Updated", {
          description: `${formData.name} has been updated.`,
        });
      } else {
        await dispatch(createAccount(accountData)).unwrap();
        toast.success("Account Added", {
          description: `${formData.name} has been added to your accounts.`,
        });
      }

      onClose();
    } catch (error) {
      toast.error("Error", {
        description: error?.message || "Something went wrong",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      balance: "0",
      color: "#3b82f6",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {accountToEdit ? "Edit Account" : "Add New Account"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="name">Account Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Cash, Bank Account, Credit Card"
              required
            />
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="balance">Starting Balance</Label>
            <Input
              id="balance"
              name="balance"
              type="number"
              step="0.01"
              value={formData.balance}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="color">Account Color</Label>
            <div className="flex gap-3">
              <Input
                id="color"
                name="color"
                type="color"
                value={formData.color}
                onChange={handleChange}
                className="w-12 h-9 p-1"
              />
              <Input
                value={formData.color}
                onChange={handleChange}
                name="color"
                placeholder="#hex"
                className="flex-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {accountToEdit ? "Save Changes" : "Add Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
