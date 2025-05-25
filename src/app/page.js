"use client";
import React from "react";
import { useSelector } from "react-redux";

const Home = () => {
  const user = useSelector((state) => state.auth);
  console.log(user);

  return <div>Home Page</div>;
};

export default Home;
