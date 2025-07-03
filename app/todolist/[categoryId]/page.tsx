"use client";
import { TodoProvider } from "@/app/context/TodoContext";
import { useParams } from "next/navigation";
import AddTodo from "../../components/AddTodo";
import TodoList from "../../components/TodoList";

export default function CategoryTodos() {
    const {categoryId} = useParams();
    
    return (
        <TodoProvider>
            <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
                <AddTodo categoryId={categoryId} />
                <TodoList categoryId={categoryId} />
            </main>
        </TodoProvider>
    )
}