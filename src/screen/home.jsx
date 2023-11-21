import React from "react";
import AddTodoForm from "../components/addTodoForm";
import Dashboard from "../container/dashboard";

const Home = () => {
  return (
    <div className="w-full h-[100dvh] flex flex-col justify-center items-center">
      <h1 className="font-bold text-[2rem] mt-[2rem] mb-[2rem]">Dashboard</h1>
      <AddTodoForm />
      <Dashboard />
    </div>
  );
};

export default Home;
