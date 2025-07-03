'use client';

import Link from 'next/link';
import { TodoContext, TodoProvider } from './context/TodoContext';
import AddCategory from './components/AddCategory';
import { useContext } from 'react';

type category = { id: string; categoryName: string; todos: { id: number; text: string }[] };

function HomeContent() {
  const { state, dispatch } = useContext(TodoContext);
  const appState = JSON.parse(localStorage.getItem('userData') || `${state}`);

  return (
    <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <AddCategory />
      <h1 className='text-2xl font-bold my-3 text-center'>Your Todo Categories: </h1>
      <div className='grid grid-cols-1 md:grid-cols-2 items-center gap-x-2 gap-y-2 '>
        {appState.map((category: category) => (
          <div key={category.id} className="flex items-center justify-between p-[0.75rem] border border-gray-300 rounded-sm">
            <Link href={`/todolist/${category.id}`} className='capitalize text-[#00000090] hover:underline'>
                  {category.categoryName}
            </Link>
            <button onClick={() => dispatch({ type: 'DELETE_CATEGORY', payload: category.id, categoryId: category.id })} className='cursor-pointer' style={{padding:0}}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 cursor-pointer">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          </div>
          ))}
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <TodoProvider>
      <HomeContent />
    </TodoProvider>
  );
}
