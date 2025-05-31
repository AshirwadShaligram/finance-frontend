"use client";
import { Button } from "@/components/ui/button";
import { logout } from "@/store/slice/authSlice";
import { fetchCategories } from "@/store/slice/categorySlice";
import { store } from "@/store/store";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Home = () => {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const categories = useSelector((state) => state.categories.categories);
  const categoriesLoading = useSelector((state) => state.categories.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user === null) {
      router.push("/signin");
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const result = await dispatch(fetchCategories()).unwrap();
          console.log("Home Page categories: ", result);
        } catch (error) {
          console.error("Failed to fetch categories:", error);
        }
      };

      fetchData();
    }
  }, [dispatch, user]);

  if (categoriesLoading) {
    return <div>Loading categories...</div>;
  }

  return (
    <div>
      <h1>Home Page</h1>
      <div>
        <h2>Categories ({categories.length})</h2>
        {categories.map((category) => (
          <div key={category._id}>{category.name}</div>
        ))}
      </div>
    </div>
  );
};

export default Home;
