import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../utils/constants/constants";
import { updateTodoPosition } from "../redux/actions";
import TaskItem from "../components/taskItem";

const Dashboard = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos);
  console.log(todos);

  const [pending, setPending] = useState(
    todos.filter((todo) => todo.status === "Pending")
  );
  const [inProgress, setInProgress] = useState(
    todos.filter((todo) => todo.status === "InProgress")
  );
  const [completed, setCompleted] = useState(
    todos.filter((todo) => todo.status === "Completed")
  );

  useEffect(() => {
    if (todos.length > 0) {
      setPending(todos.filter((todo) => todo.status === "Pending"));
      setInProgress(todos.filter((todo) => todo.status === "InProgress"));
      setCompleted(todos.filter((todo) => todo.status === "Completed"));
    }
  }, [todos]);

  const [, dropPending] = useDrop({
    accept: ItemTypes.TODO,
    hover: (item, monitor) => {
      const hoverIndex = todos.findIndex((todo) => todo.id === item.id);
      item.index = hoverIndex;
    },
    drop: (item, monitor) => handleDrop(item, "Pending", monitor),
  });

  const [, dropInProgress] = useDrop({
    accept: ItemTypes.TODO,
    hover: (item, monitor) => {
      const hoverIndex = todos.findIndex((todo) => todo.id === item.id);
      item.index = hoverIndex;
    },
    drop: (item, monitor) => handleDrop(item, "InProgress", monitor),
  });

  const [, dropCompleted] = useDrop({
    accept: ItemTypes.TODO,
    hover: (item, monitor) => {
      const hoverIndex = todos.findIndex((todo) => todo.id === item.id);
      item.index = hoverIndex;
    },
    drop: (item, monitor) => handleDrop(item, "Completed", monitor),
  });

  const handleDrop = async (item, newStatus, monitor) => {
    if (item.status !== newStatus) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/todos/${item.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: newStatus,
              index: item.index,
            }),
          }
        );

        const updatedTodo = { ...item, status: newStatus };
        dispatch(updateTodoPosition(updatedTodo.id, newStatus));
        updateSection(newStatus);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const sectionTodos = todos.filter((todo) => todo.status === newStatus);
        const dropIndex = sectionTodos.findIndex((todo) => todo.id === item.id);
        const clientOffset = monitor.getClientOffset();
        const hoverBoundingRect = monitor.getSourceClientOffset();
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;
        const hoverIndex =
          hoverClientY < hoverMiddleY ? dropIndex - 1 : dropIndex + 1;

        if (dropIndex !== hoverIndex) {
          const draggingTodo = sectionTodos[dropIndex];
          const newTodos = [...sectionTodos];
          newTodos.splice(dropIndex, 1);
          newTodos.splice(hoverIndex, 0, draggingTodo);

          // Update the index of each task
          const updatedTodos = newTodos.map((todo, index) => ({
            ...todo,
            index,
          }));

          const response = await fetch(
            `http://localhost:5000/api/todos/${item.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                status: newStatus,
                index: updatedTodos.findIndex((todo) => todo.id === item.id),
              }),
            }
          );

          updateSection(newStatus, updatedTodos);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const updateSection = (status, newTodo = []) => {
    const allTodos =
      newTodo.length > 0
        ? newTodo
        : todos.filter((todo) => todo.status === status);
    switch (status) {
      case "Pending":
        setPending(allTodos);
        break;
      case "InProgress":
        setInProgress(allTodos);
        break;
      case "Completed":
        setCompleted(allTodos);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-row gap-4 w-full h-full p-8 justify-center">
      <div
        className="rounded-md p-4 h-[50rem] w-[30rem] flex flex-col gap-2 select-none shadow-lg bg-slate-100 overflow-y-scroll"
        ref={dropPending}
      >
        <h2 className="bg-slate-200 p-2 rounded-md text-center font-semibold text-[1.3rem] mb-4">
          Pending
        </h2>
        {pending.length === 0 ? (
          <div className="shadow-md rounded-md p-4 w-full mx-auto cursor-arrow select-none bg-white">
            No Task Found
          </div>
        ) : (
          pending
            .sort((a, b) => a.index - b.index)
            .map((todo, index) => (
              <TaskItem
                key={todo.id}
                title={todo.title}
                status={todo.status}
                checked={todo.checked}
                id={todo.id}
                index={index}
              />
            ))
        )}
      </div>
      <div
        className="rounded-md p-4 h-[50rem] w-[30rem] flex flex-col gap-2 select-none shadow-lg bg-slate-100 overflow-y-scroll"
        ref={dropInProgress}
      >
        <h2 className="bg-slate-200 p-2 rounded-md text-center font-semibold text-[1.3rem] mb-4">
          In Progress
        </h2>
        {inProgress.length === 0 ? (
          <div className="shadow-md rounded-md p-4 w-full mx-auto cursor-arrow select-none bg-white">
            No Task Found
          </div>
        ) : (
          inProgress
            .sort((a, b) => a.index - b.index)
            .map((todo, index) => (
              <TaskItem
                key={todo.id}
                title={todo.title}
                status={todo.status}
                checked={todo.checked}
                id={todo.id}
                index={index}
              />
            ))
        )}
      </div>
      <div
        className="rounded-md p-4 h-[50rem] w-[30rem] flex flex-col gap-2 select-none shadow-lg bg-slate-100 overflow-y-scroll"
        ref={dropCompleted}
      >
        <h2 className="bg-slate-200 p-2 rounded-md text-center font-semibold text-[1.3rem] mb-4">
          Completed
        </h2>
        {completed.length === 0 ? (
          <div className="shadow-md rounded-md p-4 w-full mx-auto cursor-arrow select-none bg-white">
            No Task Found
          </div>
        ) : (
          completed
            .sort((a, b) => a.index - b.index)
            .map((todo, index) => (
              <TaskItem
                key={todo.id}
                title={todo.title}
                status={todo.status}
                checked={todo.checked}
                id={todo.id}
                index={index}
              />
            ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
