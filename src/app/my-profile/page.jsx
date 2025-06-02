"use client";

import AccountList from "@/components/accounts/account-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CameraIcon, Edit, User, Wallet, Save } from "lucide-react";
import React, { useState, useEffect } from "react";
import { fetchAccounts } from "@/store/slice/accountSlice";
import { useDispatch, useSelector } from "react-redux";
import AccountForm from "@/components/accounts/account-form";
import { fetchCategories } from "@/store/slice/categorySlice";
import { CategoryList } from "@/components/categories/category-list";
import CategoryForm from "@/components/categories/category-form";
import { updateUserProfile } from "@/store/slice/authSlice";

const ProfilePage = () => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Get user data from Redux store
  const { user } = useSelector((state) => state.auth);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currency: user?.currency || "USD",
    language: "English",
    theme: user?.theme || "light",
  });

  const handleSaveProfile = () => {
    // In a real app, this would dispatch an action to update the user profile
    dispatch(updateUserProfile(editedUser));
    setIsEditingProfile(false);
    // Dispatch updateUser action here
  };

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className=" h-5 w-5 text-primary" />
              User Profile
            </CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </CardHeader>
          <CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <Avatar className="h-28 w-28">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {user.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                  variant="secondary"
                >
                  <CameraIcon className="h-4 w-4" />
                </Button>
              </div>

              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>

              <Separator className="my-6" />

              <div className="w-full">
                <p className="flex justify-between py-2">
                  <span className="text-muted-foreground">Currency</span>
                  <span>{user.currency}</span>
                </p>
                <p className="flex justify-between py-2">
                  <span className="text-muted-foreground">Language</span>
                  <span>{editedUser.language}</span>
                </p>
                <p className="flex justify-between py-2">
                  <span className="text-muted-foreground">Theme</span>
                  <span>{user.theme}</span>
                </p>
              </div>

              <Button
                className="mt-6 w-full"
                onClick={() => setIsEditingProfile(true)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </CardContent>
          </CardHeader>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="accounts">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="accounts">Accounts</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>

              <TabsContent value="accounts" className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium"> Your Accounts</h3>
                  <Button
                    onClick={() => setIsAddingAccount(true)}
                    variant="outline"
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Add Account
                  </Button>
                </div>

                {/* create AccountList in component  */}
                <AccountList />

                {/* Create a AccountForm in component */}
                <AccountForm
                  isOpen={isAddingAccount}
                  onClose={() => setIsAddingAccount(false)}
                />
              </TabsContent>

              <TabsContent value="categories" className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">
                    Transaction Categories
                  </h3>
                  <Button
                    onClick={() => setIsAddingCategory(true)}
                    variant="outline"
                  >
                    Add Category
                  </Button>
                </div>

                {/* Create CategoryList in components */}
                <CategoryList />
                {/* Create CategoryForm in Components */}
                <CategoryForm
                  isOpen={isAddingCategory}
                  onClose={() => setIsAddingCategory(false)}
                />
              </TabsContent>

              <TabsContent value="preferences" className="space-y-4 pt-4">
                <h3 className="text-lg font-medium">Application Preferences</h3>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input
                      id="currency"
                      value={editedUser.currency}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          currency: e.target.value,
                        })
                      }
                      disabled={!isEditingProfile}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="language">Language</Label>
                    <Input
                      id="language"
                      value={editedUser.language}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          language: e.target.value,
                        })
                      }
                      disabled={!isEditingProfile}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={editedUser.name}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, name: e.target.value })
                      }
                      disabled={!isEditingProfile}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      value={editedUser.email}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, email: e.target.value })
                      }
                      disabled={!isEditingProfile}
                      type="email"
                    />
                  </div>

                  {isEditingProfile && (
                    <Button onClick={handleSaveProfile} className="w-full">
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
