'use client';

import { useContext } from 'react';
import { TodoContext } from '../context/TodoContext';

const AddCateory = ({text, setText, addCatRefElem, storedCategoryTodos}) => {
  const { dispatch } = useContext(TodoContext);

  const handleAdd = () => {
    if (!text.trim()) return;
    dispatch({
      type: 'ADD_CATEGORY',
      payload: {
        id: `category-${text.trim().replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, '')}${Date.now()}`,
        text: text.trim().replace(/\s+/g, ' '),
        todos: storedCategoryTodos || [],
      },
    });
    setText('');
  };

  return (
    <div className='grid grid-cols-4 gap-x-2 rounded-md p-2 flex items-center justify-between'>
      <input
        ref={addCatRefElem}
        type="text"
        placeholder="Enter Category"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        className='col-span-3 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-0'
      />
      <button onClick={handleAdd} className='col-span-1 bg-blue-500 text-white rounded-md px-4 py-2 cursor-pointer'>Add Category</button>
    </div>
  );
};

export default AddCateory;
