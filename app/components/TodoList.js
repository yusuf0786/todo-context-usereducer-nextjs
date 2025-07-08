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
    touchAction: 'none'
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`touch-none flex items-center justify-between mb-4 ps-0 ${
        index === selectedState.todos.length - 1 ? 'border-b-0' : 'border-b-2'
      } border-dotted pb-4`}
    >
      <span className="font-(family-name:--font-handstyle) me-2">{todo.text}</span>
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







// 'use client';

// import { useContext, useEffect, useState } from 'react';
// import { TodoContext } from '../context/TodoContext';

// const TodoList = ({ categoryId, addInputRefElem, setText }) => {
//   const { state, dispatch } = useContext(TodoContext);
//   const [selectedState, setSelectedState] = useState(null);

//   useEffect(() => {
//     const stored = localStorage.getItem('userData');
//     if (stored) {
//       const localState = JSON.parse(stored);
//       const selected = localState.find(d => d.id === categoryId);
//       setSelectedState(selected);
//     }
//   }, [state, categoryId]);

//   const handleEdit = (todo) => {
//     setText(todo.text);
//     dispatch({ type: 'DELETE_TODO', payload: todo.id, categoryId: selectedState.id });
//     addInputRefElem.current?.focus();
//   };

//   if (!selectedState) return null; // or a loading spinner

//   return (
//     <>
//       <h1 className="text-2xl font-bold my-3 underline text-center opacity-75">
//         {selectedState.categoryName}
//       </h1>
//       <ul>
//         {selectedState.todos.map((todo, index) => (
//           <li key={todo.id} className={`flex items-center justify-between mb-4 ps-0 ${index === selectedState.todos.length - 1 ? 'border-b-0' : 'border-b-2'} border-dotted pb-4`}>
//             <span className="font-(family-name:--font-handstyle) me-2">
//               {todo.text}
//             </span>
//             <div className='flex md:flex-nowrap flex-wrap max-w-[96px]'>
//               <button onClick={() => handleEdit(todo)} className="cursor-pointer" >
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
//                 </svg>
//               </button>
//               <button onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id, categoryId: selectedState.id })} className="cursor-pointer">
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
//                 </svg>
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </>
//   );
// };

// export default TodoList;