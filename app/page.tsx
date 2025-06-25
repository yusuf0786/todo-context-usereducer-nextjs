import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';
import { TodoProvider } from './context/TodoContext';

export default function Home() {
  return (
    <TodoProvider>
      <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        {/* <h1 className='mb-2'>Todo List</h1> */}
        <AddTodo />
        <TodoList />
      </main>
    </TodoProvider>
  );
}
