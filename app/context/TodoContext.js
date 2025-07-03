'use client'; // Needed for Context API in App Router

import { createContext, useReducer } from 'react';
import {data} from '../data';

let initialState = await data();

// const getUaerData = () => JSON.parse(localStorage.getItem('userData') || '[]');

const todoReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      const newState = state.map(category => {
        if (category.id === action.categoryId) {
          return {
            ...category,
            todos: [...category.todos, action.payload]
          };
        }
        return category;
      });
      localStorage.setItem('userData', JSON.stringify(newState));
      return newState;

    case 'ADD_CATEGORY':
      const newCategory = [...state, {
        categoryName: action.payload.text,
        id: action.payload.id,
        todos: []
      }];
      localStorage.setItem('userData', JSON.stringify(newCategory));
      return newCategory;

    case 'DELETE_TODO':
      const newDeletedState =  state.map(category => {
        if (category.id === action.categoryId) {
          return {
            ...category,
            todos: category.todos.filter(todo => todo.id !== action.payload)
          };
        }
        return category;
      });
      localStorage.setItem('userData', JSON.stringify(newDeletedState));
      return newDeletedState;

    case 'DELETE_CATEGORY':
      const newDeletedCatState = state.filter(category => category.id !== action.categoryId);
      localStorage.setItem('userData', JSON.stringify(newDeletedCatState));
      return newDeletedCatState;
    default:
      return state;
  }
};

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const xdata = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : initialState;
  localStorage.setItem('userData', JSON.stringify(xdata));
  const [state, dispatch] = useReducer(todoReducer, xdata);

  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
};
