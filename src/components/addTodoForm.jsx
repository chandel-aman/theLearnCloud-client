import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTodo } from "../redux/actions";
import axios from "axios";

const AddTodoForm = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos);
  const [title, setTitle] = useState("");

  const handleAddTodo = async (e) => {
    e.preventDefault();
    const newTodo = {
      date: Date.now(),
      title,
      checked: false,
      status: "Pending",
      index: todos.filter((todo) => todo.status === "Pending").length + 1,
    };

    try {
      const response = await axios.post(
        "https://cute-puce-turkey-tux.cyclic.app/api/todos",
        newTodo,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      dispatch(addTodo(newTodo));
    } catch (error) {
      console.error(error);
    }

    setTitle("");
  };

  return (
    <form
      onSubmit={handleAddTodo}
      className="flex gap-2 w-full h-max py-2 justify-center items-center"
    >
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="bg-transparent rounded-md shadow-md p-3"
      />
      <button type="submit" className="bg-slate-200 px-5 py-3 rounded-md shadow-md">
        +
      </button>
    </form>
  );
};

export default AddTodoForm;
