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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Lock,
  KeyRound,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { resetPassword, clearAuthError } from "@/store/slice/authSlice";
import { useDispatch, useSelector } from "react-redux";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const router = useRouter();
  const params = useParams();
  const resetToken = params.token;

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  // Password validation
  const passwordRequirements = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  useEffect(() => {
    if (!resetToken) {
      setTokenValid(false);
    }
  }, [resetToken]);

  useEffect(() => {
    if (error) {
      if (error.includes("invalid") || error.includes("expired")) {
        setTokenValid(false);
      }
      toast.error("Failed to reset password", {
        description: error,
        duration: 4000,
      });
      dispatch(clearAuthError());
    }
  }, [error, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error("Please meet all password requirements");
      return;
    }

    if (!passwordsMatch) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const result = await dispatch(
        resetPassword({ resetToken, password })
      ).unwrap();

      if (result) {
        setIsSuccess(true);
        toast.success("Password reset successful!", {
          description: "You can now login with your new password",
          duration: 5000,
        });

        // Only redirect after showing success message
        setTimeout(() => {
          router.push("/signin");
        }, 5000);
      }
    } catch (error) {
      // Error is already handled by the error effect
      console.error("Reset password error:", error);
    }
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-6">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-xl">Invalid Reset Link</CardTitle>
              <CardDescription>
                This password reset link is invalid or has expired.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/signin">
                <Button className="w-full">
                  Back to Sign In <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-6">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-xl">
                Password Reset Successful!
              </CardTitle>
              <CardDescription>
                Your password has been successfully updated. You will be
                redirected to the login page shortly.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/signin">
                <Button className="w-full">
                  Continue to Sign In <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header Card */}
        <Card className="relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <KeyRound className="h-6 w-6" />
              Reset Password
            </CardTitle>
            <CardDescription className="text-white/80">
              Create a new secure password for your account
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Reset Form Card */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-9"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Requirements */}
              {password && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Password Requirements:
                  </Label>
                  <div className="grid grid-cols-1 gap-1 text-xs">
                    {Object.entries(passwordRequirements).map(
                      ([key, isValid]) => (
                        <div
                          key={key}
                          className={`flex items-center gap-2 ${
                            isValid ? "text-green-600" : "text-muted-foreground"
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              isValid ? "bg-green-600" : "bg-muted-foreground"
                            }`}
                          />
                          {key === "length" && "At least 8 characters"}
                          {key === "lowercase" && "One lowercase letter"}
                          {key === "uppercase" && "One uppercase letter"}
                          {key === "number" && "One number"}
                          {key === "special" && "One special character"}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Password match indicator */}
              {confirmPassword && (
                <Alert
                  className={
                    passwordsMatch
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }
                >
                  <AlertDescription
                    className={
                      passwordsMatch ? "text-green-700" : "text-red-700"
                    }
                  >
                    {passwordsMatch
                      ? "Passwords match"
                      : "Passwords do not match"}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full mt-6"
                disabled={loading || !isPasswordValid || !passwordsMatch}
              >
                {loading ? (
                  "Resetting Password..."
                ) : (
                  <>
                    Reset Password <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Back to Sign In */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="py-4 text-center">
            <p className="text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link
                href="/signin"
                className="text-primary font-medium hover:underline inline-flex items-center"
              >
                Back to Sign In <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
