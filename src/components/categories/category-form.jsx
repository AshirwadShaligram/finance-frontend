"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";

const CategoryForm = ({ isOpen, onClose, categoryToEdit }) => {
  const [formData, setFormData] = useState({
    name: categoryToEdit?.name,
    type: categoryToEdit?.type || "expense",
    color: categoryToEdit?.color || "#3b82f6",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      type: "expense",
      color: "#3b82f6",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {categoryToEdit ? "Edit Category" : "Add New Category"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Salary, Food, Transportation"
              required
            />
          </div>

          <div className="grid w-full items-center gap-2">
            <Label>Category Type</Label>
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
            <Label htmlFor="color">Category Color</Label>
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
              {categoryToEdit ? "Save Changes" : "Add Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryForm;
