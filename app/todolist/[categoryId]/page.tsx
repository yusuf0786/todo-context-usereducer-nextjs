"use client";
import { TodoProvider } from "@/app/context/TodoContext";
import { useParams } from "next/navigation";
import AddTodo from "../../components/AddTodo";
import TodoList from "../../components/TodoList";
import { useRef, useState } from "react";

export default function CategoryTodos() {
    const [text, setText] = useState('');
    const addInputRefElem = useRef<HTMLInputElement>(null)
    const {categoryId} = useParams();
    
    return (
        <TodoProvider>
            <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
                <AddTodo categoryId={categoryId} addInputRefElem={addInputRefElem} text={text} setText={setText} />
                <TodoList categoryId={categoryId} addInputRefElem={addInputRefElem} setText={setText} />
            </main>
        </TodoProvider>
    )
}