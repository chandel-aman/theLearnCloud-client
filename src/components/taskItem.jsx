import React from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../utils/constants/constants";
import { useDispatch } from "react-redux";
import { updateTodoPosition } from "../redux/actions";

const TaskItem = ({ title, status, id, checked, index }) => {
  const dispatch = useDispatch();
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TODO,
    item: { id, title, checked, status, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const handleCheckboxChange = async () => {
    try {
      await fetch(`http://localhost:5000/api/todos/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: Completed,
          index: index,
        }),
      });
      dispatch(
        updateTodoPosition(
          id,
          status.toLowerCase() !== "completed" ? "Completed" : "Pending"
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`shadow-md flex gap-3 rounded-md bg-white hover:bg-slate-200 p-4 w-full mx-auto cursor-move select-none opacity-${
        isDragging ? 0.5 : 1
      }`}
      ref={drag}
    >
      <input
        type="checkbox"
        checked={status.toLowerCase() === "completed"}
        onChange={handleCheckboxChange}
      />
      <p
        className={`${
          status.toLowerCase() === "completed" ? "line-through" : ""
        }`}
      >
        {title}
      </p>
    </div>
  );
};

export default TaskItem;
