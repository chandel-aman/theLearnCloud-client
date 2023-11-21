import {
  ADD_TODO,
  TOGGLE_TODO,
  UPDATE_TODO_POSITION,
  SET_TODOS,
} from "./actionTypes";

const initialState = {
  todos: [],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TODO:
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };
    case TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, checked: !todo.checked }
            : todo
        ),
      };
    case UPDATE_TODO_POSITION:
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, status: action.payload.status }
            : todo
        ),
      };
    case SET_TODOS:
      return {
        ...state,
        todos: action.payload,
      };
    default:
      return state;
  }
};

export default rootReducer;
