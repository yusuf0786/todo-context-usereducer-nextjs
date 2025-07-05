'use client';

// import Link from 'next/link';
import { TodoContext, TodoProvider } from './context/TodoContext';
import AddCategory from './components/AddCategory';
import { useContext, useRef, useState, useEffect, useCallback } from 'react';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import DraggableCategory from './components/DraggableCategory';

type category = { id: string; categoryName: string; todos: { id: number; text: string }[] };

function HomeContent() {
  const [text, setText] = useState('');
  const [storedCategoryTodos, setStoredCategoryTodos] = useState<{ id: number; text: string }[]>([]);
  const [appState, setAppState] = useState<category[]>([]);
  const addCatRefElem = useRef<HTMLInputElement>(null);
  const { state, dispatch } = useContext(TodoContext);

  useEffect(() => {
    const stored = localStorage.getItem('userData');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAppState(parsed);
      } catch (err) {
        console.error("Error parsing localStorage data:", err);
      }
    } else {
      setAppState(state);
    }
  }, [state]);

  const handleEdit = (category: category) => {
    setText(category.categoryName);
    setStoredCategoryTodos(category.todos);
    dispatch({ type: 'DELETE_CATEGORY', payload: category.id, categoryId: category.id });
    addCatRefElem.current?.focus();
  };

  const handleDelete = (category: category) => {
    const confirmDelete = window.confirm(`Delete category: ${category.categoryName}?`);
    if (confirmDelete) {
      dispatch({ type: 'DELETE_CATEGORY', payload: category.id, categoryId: category.id });
    }
  };

  const handleOndrop = useCallback(() => {
    dispatch({ type: 'REORDER_CATEGORY', payload: appState });
  }, [dispatch, appState])

  let setAppStateTimeout: NodeJS.Timeout | null = null;
  const moveCategory = (fromIndex: number, toIndex: number) => {
    if (setAppStateTimeout) clearTimeout(setAppStateTimeout);
    setAppStateTimeout = setTimeout(() => {
      setAppState((prev) => {
        const updated = [...prev];
        const [movedItem] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, movedItem);
        return updated;
      });
    }, 200);
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <AddCategory text={text} setText={setText} addCatRefElem={addCatRefElem} storedCategoryTodos={storedCategoryTodos} />
      <h1 className='text-2xl font-bold my-3 text-center'>Your Todo Categories:</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 items-center gap-x-2 gap-y-2'>
        {appState.map((category, index) => (
          <DraggableCategory
            key={category.id}
            category={category}
            index={index}
            moveCategory={moveCategory}
            onEdit={handleEdit}
            onDelete={handleDelete}
            handleOndrop={handleOndrop}
          />
        ))}
      </div>
    </main>
  );
}

// export default function Home() {
//   return (
//     <TodoProvider>
//       <HomeContent />
//     </TodoProvider>
//   );
// }

export default function Home() {
  return (
    <DndProvider backend={HTML5Backend}>
      <TodoProvider>
        <HomeContent />
      </TodoProvider>
    </DndProvider>
  );
}