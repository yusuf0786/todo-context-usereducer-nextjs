'use client';

import { useContext, useState } from 'react';
import { TodoContext } from '../context/TodoContext';

const AddTodo = () => {
  const [text, setText] = useState('');
  const { dispatch } = useContext(TodoContext);

  const handleAdd = () => {
    if (!text.trim()) return;
    dispatch({
      type: 'ADD_TODO',
      payload: { id: Date.now(), text }
    });
    setText('');
  };

  return (
    <div className='bg-white rounded-md p-4 flex items-center justify-between'>
      <input
        type="text"
        placeholder="Enter todo"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        className='w-100 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-0'
      />
      <button onClick={handleAdd} className='bg-blue-500 text-white rounded-md px-4 py-2 cursor-pointer'>Add</button>
    </div>
  );
};

export default AddTodo;
