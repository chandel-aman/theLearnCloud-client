import { useDispatch, useSelector } from "react-redux";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../../utils/constants/constants";
import { updateTodoPosition } from "../../redux/actions";

const useSectionDrop = (status) => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos);

  const [, drop] = useDrop({
    accept: ItemTypes.TODO,
    drop: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        // Handle intra-section dragging and reordering
        const updatedTodos = handleIntraSectionDrop(item, status);
        dispatch(updateTodoPosition(updatedTodos));
        // You might want to update the position in the database here
      } else {
        // Handle inter-section dragging
        const updatedTodos = handleInterSectionDrop(item, status);
        dispatch(updateTodoPosition(updatedTodos));
        // You might want to update the position in the database here
      }
    },
  });

  const handleIntraSectionDrop = (item, status) => {
    const updatedTodos = [...todos];
    const draggedTodo = updatedTodos.find((todo) => todo.id === item.id);
    const sectionTodos = updatedTodos.filter((todo) => todo.status === status);

    const dropIndex = sectionTodos.findIndex(
      (todo) => todo.id === draggedTodo.id
    );
    const hoverIndex = sectionTodos.findIndex((todo) => todo.id === item.id);

    sectionTodos.splice(dropIndex, 1);
    sectionTodos.splice(hoverIndex, 0, draggedTodo);

    return updatedTodos.map((todo) =>
      todo.status === status ? sectionTodos.shift() : todo
    );
  };

  const handleInterSectionDrop = (item, status) => {
    const updatedTodos = [...todos];
    const draggedTodo = updatedTodos.find((todo) => todo.id === item.id);

    draggedTodo.status = status;

    return updatedTodos;
  };

  return [drop];
};

export default useSectionDrop;
