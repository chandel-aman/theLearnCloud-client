// actions.js
export const addTodo = (todo) => ({
  type: "ADD_TODO",
  payload: todo,
});

export const toggleTodo = (id) => ({
  type: "TOGGLE_TODO",
  payload: id,
});

export const updateTodoPosition = (id, status) => ({
  type: "UPDATE_TODO_POSITION",
  payload: { id, status },
});

export const setTodos = (todos) => ({
  type: "SET_TODOS",
  payload: todos,
});
