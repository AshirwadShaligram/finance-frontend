"use client";
import { Button } from "@/components/ui/button";
import { logout } from "@/store/slice/authSlice";
import { store } from "@/store/store";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Home = () => {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user === null) {
      router.push("/signin");
    }
  }, [user, router]);

  console.log(store.getState());

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    router.push("/signin");
  };

  return (
    <div>
      <h1>Home Page</h1>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
};

export default Home;
