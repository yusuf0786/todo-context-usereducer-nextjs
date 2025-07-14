'use client';

import { useContext, useEffect, useState } from 'react';
import { TodoContext } from '../context/TodoContext';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableTodoItem = ({ todo, index, selectedState, handleEdit, handleDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'auto',
  };

  const dragHandleStyle = {
    touchAction: 'none'
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`touch-none flex items-center justify-between mb-4 ps-0 ${
        index === selectedState.todos.length - 1 ? 'border-b-0' : 'border-b-2'
      } border-dotted pb-4`}
    >
      <span className='flex align-top'>
        {/* DRAG HANDLE ICON */}
        <span style={dragHandleStyle} {...listeners} {...attributes} className="cursor-grab me-2 select-none" title="Drag to reorder">⠿</span>

        {/* TODO TEXT */}
        <span className="font-(family-name:--font-handstyle) me-2 flex-1">{todo.text}</span>
      </span>

      {/* ACTION BUTTONS */}
      <div className="flex md:flex-nowrap flex-wrap max-w-[96px]">
        <button onClick={() => handleEdit(todo)} className="cursor-pointer p-1 me-1">✏️</button>
        <button onClick={() => handleDelete(todo.id)} className="cursor-pointer p-1">🗑️</button>
      </div>
    </li>
  );
};

const TodoList = ({ categoryId, addInputRefElem, setText }) => {
  const { state, dispatch } = useContext(TodoContext);
  const [selectedState, setSelectedState] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    })
  );


  useEffect(() => {
    const stored = localStorage.getItem('userData');
    if (stored) {
      const localState = JSON.parse(stored);
      const selected = localState.find((d) => d.id === categoryId);
      setSelectedState(selected);
    }
  }, [state, categoryId]);

  const handleEdit = (todo) => {
    setText(todo.text);
    dispatch({ type: 'DELETE_TODO', payload: todo.id, categoryId });
    addInputRefElem.current?.focus();
  };

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_TODO', payload: id, categoryId });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = selectedState.todos.findIndex((todo) => todo.id === active.id);
    const newIndex = selectedState.todos.findIndex((todo) => todo.id === over.id);

    const newTodos = arrayMove(selectedState.todos, oldIndex, newIndex);

    const updatedCategory = {
      ...selectedState,
      todos: newTodos,
    };

    const updatedState = state.map((category) =>
      category.id === categoryId ? updatedCategory : category
    );

    localStorage.setItem('userData', JSON.stringify(updatedState));
    dispatch({ type: 'SET_ALL', payload: updatedState });
  };

  if (!selectedState) return null;

  return (
    <>
      <h1 className="text-2xl font-bold my-3 underline text-center opacity-75">
        {selectedState.categoryName}
      </h1>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={selectedState.todos.map((todo) => todo.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul>
            {selectedState.todos.map((todo, index) => (
              <SortableTodoItem
                key={todo.id}
                todo={todo}
                index={index}
                selectedState={selectedState}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </>
  );
};

export default TodoList;