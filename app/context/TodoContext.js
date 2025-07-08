'use client';

import { createContext, useReducer, useEffect } from 'react';

export const TodoContext = createContext();

const todoReducer = (state, action) => {
  let updatedState;

  switch (action.type) {
    case 'ADD_TODO':
      updatedState = state.map(category => {
        if (category.id === action.categoryId) {
          return {
            ...category,
            todos: [action.payload, ...category.todos],
          };
        }
        return category;
      });
      break;

    case 'ADD_CATEGORY':
      updatedState = [{
        categoryName: action.payload.text,
        id: action.payload.id,
        todos: action.payload.todos || [],
      }, ...state];
      break;

    case 'REORDER_CATEGORY':
      updatedState = [...action.payload];
      break;

    case 'REORDER_TODO':
      updatedState = state.map(category => {
        if (category.id === action.categoryId) {
          return {
            ...category,
            todos: action.payload,
          };
        }
        return category;
      });
      break;

    case 'DELETE_TODO':
      updatedState = state.map(category => {
        if (category.id === action.categoryId) {
          return {
            ...category,
            todos: category.todos.filter(todo => todo.id !== action.payload),
          };
        }
        return category;
      });
      break;

    case 'DELETE_CATEGORY':
      updatedState = state.filter(category => category.id !== action.categoryId);
      break;

    case 'SET_INITIAL_STATE':
      updatedState = action.payload;
      break;

    case 'SET_ALL':
      updatedState = action.payload;
      break;

    default:
      return state;
  }

  // Persist to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('userData', JSON.stringify(updatedState));
  }

  return updatedState;
};

export const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    todoReducer,
    [],
    () => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('userData');
        return stored ? JSON.parse(stored) : [];
      }
      return [];
    }
  );

  // Fetch from API if localStorage is empty
  useEffect(() => {
    const fetchData = async () => {
      const stored = localStorage.getItem('userData');
      if (!stored || JSON.parse(stored).length === 0) {
        try {
          const res = await fetch('/api');
          const data = await res.json();
          dispatch({ type: 'SET_INITIAL_STATE', payload: data });
        } catch (err) {
          console.error('Failed to fetch data:', err);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
};
