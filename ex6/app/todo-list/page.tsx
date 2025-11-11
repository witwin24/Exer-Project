'use client'
import { useState, useEffect } from "react";

export default function TodoListPage() {
    type Todo = {
        id: number;
        detail: string;
        status: "pending" | "completed";
    }

    const [todos, setTodos] = useState<Todo[]>([])

    useEffect(() => {
        const saved = localStorage.getItem("todos");
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (saved) setTodos(JSON.parse(saved));
    }, []);
    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);

    const [detail, setDetail] = useState<string>("");
    const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "completed">("all");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!detail.trim()) return;
        const newTodo: Todo = {
            id: Date.now(),
            detail,
            status: "pending"
        }
        setTodos([...todos, newTodo]);
        setDetail("");
    }

    function handleComplete(id: number) {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, status: todo.status === "completed" ? "pending" : "completed" } : todo
        ));
    }

    function handleDelete(id: number) {
        setTodos(todos.filter(todo => todo.id !== id));
    }

    function handleFilter(status: "all" | "pending" | "completed") {
        setFilterStatus(status);
    }

    const filterTodos = todos.filter(todo =>
        filterStatus === "all" ? true : todo.status === filterStatus
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Todo List</h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex gap-2 mb-4 w-full max-w-md">
                <input
                    type="text"
                    name="detail"
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                    placeholder="Enter todo detail"
                    autoFocus
                    className="flex-1 border border-gray-400 px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 shadow"
                >
                    Add
                </button>
            </form>

            {/* Filter */}
            <div className="w-full max-w-md flex justify-end mb-4">
                <label htmlFor="filter" className="mr-2 font-medium text-gray-700">Filter:</label>
                <select
                    id="filter"
                    value={filterStatus}
                    onChange={(e) => handleFilter(e.target.value as "all" | "pending" | "completed")}
                    className="border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            {/* Table */}
            <div className="w-full max-w-2xl overflow-x-auto shadow rounded">
                <table className="min-w-full bg-white rounded shadow overflow-hidden">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="text-left px-4 py-2 border-b">Todo</th>
                            <th className="text-left px-4 py-2 border-b">Status</th>
                            <th className="text-left px-4 py-2 border-b">Manage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterTodos.length > 0 ? filterTodos.map((todo) => (
                            <tr key={todo.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border-b">{todo.detail}</td>
                                <td className="px-4 py-2 border-b">{todo.status}</td>
                                <td className="px-4 py-2 border-b flex gap-2">
                                    <button
                                        onClick={() => handleComplete(todo.id)}
                                        className={`px-3 py-1 rounded text-white font-medium shadow ${todo.status === "completed"
                                                ? "bg-gray-500 hover:bg-gray-600"
                                                : "bg-green-500 hover:bg-green-600"
                                            }`}
                                    >
                                        {todo.status === "completed" ? "UnComplete" : "Complete"}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(todo.id)}
                                        className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 shadow font-medium"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={3} className="text-center py-4 text-gray-500">No todos found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
