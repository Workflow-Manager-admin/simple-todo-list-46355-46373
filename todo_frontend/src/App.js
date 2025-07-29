import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// PUBLIC_INTERFACE
function App() {
  // Main todo state - stored as an array of { id, text, completed }
  const [todos, setTodos] = useState(() => {
    // Simple localStorage persistence for demo
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef(null);

  // Save todos to localStorage on change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Focus on input when starting edit
  useEffect(() => {
    if (editId !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editId]);

  // PUBLIC_INTERFACE
  function handleAddTodo(e) {
    e.preventDefault();
    if (!input.trim()) return;
    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: input.trim(),
        completed: false,
      },
    ]);
    setInput("");
  }

  // PUBLIC_INTERFACE
  function handleDeleteTodo(id) {
    setTodos(todos.filter((t) => t.id !== id));
  }

  // PUBLIC_INTERFACE
  function handleToggleComplete(id) {
    setTodos(
      todos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  }

  // PUBLIC_INTERFACE
  function handleStartEdit(id, value) {
    setEditId(id);
    setEditValue(value);
  }

  // PUBLIC_INTERFACE
  function handleEditChange(e) {
    setEditValue(e.target.value);
  }

  // PUBLIC_INTERFACE
  function handleEditSave(e) {
    e.preventDefault();
    if (!editValue.trim()) return;
    setTodos(
      todos.map((t) =>
        t.id === editId ? { ...t, text: editValue.trim() } : t
      )
    );
    setEditId(null);
    setEditValue("");
  }

  // PUBLIC_INTERFACE
  function handleEditCancel() {
    setEditId(null);
    setEditValue("");
  }

  return (
    <div className="App" style={{ minHeight: "100vh" }}>
      <header className="todo-header">
        <h1 className="todo-title">minimalistic todo</h1>
        <p className="todo-subtitle">
          Simple. Clean. Get things done.
        </p>
      </header>
      <main className="todo-main">
        <section className="todo-input-section">
          <form onSubmit={handleAddTodo} className="todo-form">
            <input
              className="todo-input"
              type="text"
              value={input}
              placeholder="Add a new todo"
              onChange={e => setInput(e.target.value)}
              aria-label="Add a new todo"
              maxLength={120}
              autoFocus
            />
            <button className="todo-add-btn" type="submit" aria-label="Add Todo">
              +
            </button>
          </form>
        </section>

        <ul className="todo-list" aria-label="Todo List">
          {todos.length === 0 ? (
            <li className="todo-empty">Nothing to do!</li>
          ) : (
            todos.map((todo) =>
              editId === todo.id ? (
                <li className="todo-item editing" key={todo.id}>
                  <form
                    onSubmit={handleEditSave}
                    className="todo-edit-form"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <input
                      ref={inputRef}
                      className="todo-edit-input"
                      value={editValue}
                      onChange={handleEditChange}
                      onKeyDown={e => {
                        if (e.key === "Escape") {
                          handleEditCancel();
                        }
                      }}
                      maxLength={120}
                      aria-label="Edit todo"
                    />
                    <button type="submit" className="todo-save-btn" aria-label="Save">
                      Save
                    </button>
                    <button
                      type="button"
                      className="todo-cancel-btn"
                      onClick={handleEditCancel}
                      aria-label="Cancel"
                    >
                      Cancel
                    </button>
                  </form>
                </li>
              ) : (
                <li className="todo-item" key={todo.id}>
                  <label className="todo-checkbox-label">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleComplete(todo.id)}
                      aria-label={`Mark as ${todo.completed ? "incomplete" : "completed"}`}
                    />
                    <span
                      className={
                        "todo-text" + (todo.completed ? " completed" : "")
                      }
                    >
                      {todo.text}
                    </span>
                  </label>
                  <div className="todo-actions">
                    <button
                      className="todo-edit-btn"
                      aria-label="Edit"
                      onClick={() => handleStartEdit(todo.id, todo.text)}
                    >
                      ✏️
                    </button>
                    <button
                      className="todo-delete-btn"
                      aria-label="Delete"
                      onClick={() => handleDeleteTodo(todo.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              )
            )
          )}
        </ul>
      </main>
      <footer className="todo-footer">
        <span className="todo-footer-text">
          &copy; {new Date().getFullYear()} Simple Todo · All minimal, all yours.
        </span>
      </footer>
    </div>
  );
}

export default App;
