"use client";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  loginUser,
  forgotPassword,
  clearAuthError,
} from "@/store/slice/authSlice";
import { Lock, Mail, ArrowRight, KeyRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { fetchAccounts } from "@/store/slice/accountSlice";
import { fetchCategories } from "@/store/slice/categorySlice";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  // Get auth state from Redux
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  // Handle login success
  useEffect(() => {
    if (isAuthenticated) {
      const fetchInitialData = async () => {
        try {
          await dispatch(fetchAccounts());
          await dispatch(fetchCategories());
          toast.success("Welcome back!");
          router.push("/");
        } catch (error) {
          console.error("Failed to fetch initial data:", error);
          toast.error("Login successful, but failed to load data");
          router.push("/");
        }
      };

      fetchInitialData();
    }
  }, [isAuthenticated, dispatch, router]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error("Login failed", {
        description: error,
        duration: 4000,
      });
      // Clear form on error
      setEmail("");
      setPassword("");
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      // Clear form on success
      setEmail("");
      setPassword("");
    } catch (error) {
      // Error handling is done in useEffect
      console.error("Login error:", error);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!forgotEmail) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      await dispatch(forgotPassword(forgotEmail)).unwrap();

      toast.success("Password reset email sent!", {
        description: "Check your email for reset instructions",
        duration: 5000,
      });

      setForgotEmail("");
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to send reset email", {
        description: error,
        duration: 4000,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header Card with Gradient */}
        <Card className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
          <CardHeader>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription className="text-white/80">
              Enter your credentials to access your financial dashboard
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Login Form Card */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto text-xs text-primary hover:underline"
                        disabled={loading}
                      >
                        Forgot password?
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <KeyRound className="h-5 w-5" />
                          Reset Password
                        </DialogTitle>
                        <DialogDescription>
                          Enter your email address and we'll send you a link to
                          reset your password.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleForgotPassword}>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="forgot-email">Email</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="forgot-email"
                                type="email"
                                placeholder="Enter your email"
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                                className="pl-9"
                                required
                                disabled={loading}
                              />
                            </div>
                          </div>
                        </div>
                        <DialogFooter className="mt-6">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            disabled={loading}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={loading}>
                            {loading ? "Sending..." : "Send Reset Link"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full mt-2" disabled={loading}>
                {loading ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign In <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sign Up Prompt Card */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="py-4 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-primary font-medium hover:underline inline-flex items-center"
              >
                Register <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signin;
