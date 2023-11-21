import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setTodos } from "./redux/actions";

import Home from "./screen/home";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/todos");
        const todos = response.data;
        dispatch(setTodos(todos));
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    fetchTodos();
  }, [dispatch]);
  return (
    <>
      <Home />
    </>
  );
};

export default App;
