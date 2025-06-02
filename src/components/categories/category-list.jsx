"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
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
} from "../ui/alert-dialog";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { deleteCategory } from "@/store/slice/categorySlice";
import CategoryForm from "./category-form";

export const CategoryList = () => {
  const categories = useSelector((state) => state.categories.categories);
  const dispatch = useDispatch();

  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);

  const handleDelete = () => {
    if (!deletingCategory) return;

    try {
      dispatch(deleteCategory(deletingCategory._id))
        .unwrap()
        .then(() => {
          toast.success("Category Deleted", {
            description: `${deletingCategory.name} has been removed.`,
          });
        })
        .catch((error) => {
          toast.error({
            description: error?.message || "Something went wrong",
            variant: "destructive",
          });
        });
    } finally {
      setDeletingCategory(null);
    }
  };

  const incomeCategories = categories.filter((c) => c.type === "income");
  const expenseCategories = categories.filter((c) => c.type === "expense");

  return (
    <div>
      <Tabs defaultValue="expense">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="expense">Expense Categories</TabsTrigger>
          <TabsTrigger value="income">Income Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="expense" className="space-y-4 pt-4">
          {expenseCategories.length === 0 ? (
            <div className="text-center p-6 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">
                No expense categories found.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {expenseCategories.map((category) => (
                <div
                  key={category._id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                  style={{
                    borderLeftColor: category.color,
                    borderLeftWidth: "4px",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span>{category.name}</span>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingCategory(category)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setDeletingCategory({
                          id: category.id,
                          name: category.name,
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="income" className="space-y-4 pt-4">
          {incomeCategories.length === 0 ? (
            <div className="text-center p-6 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">
                No income categories found.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {incomeCategories.map((category) => (
                <div
                  key={category._id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                  style={{
                    borderLeftColor: category.color,
                    borderLeftWidth: "4px",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span>{category.name}</span>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingCategory(category)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setDeletingCategory({
                          id: category.id,
                          name: category.name,
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Category Form */}
      {editingCategory && (
        <CategoryForm
          isOpen={!!editingCategory}
          onClose={() => setEditingCategory(null)}
          categoryToEdit={editingCategory}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingCategory}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category "
              {deletingCategory?.name}". This action cannot be undone if there
              are transactions using this category.
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
};
