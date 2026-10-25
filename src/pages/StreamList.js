import React, { useState, useEffect, useCallback } from 'react';
import { PlusCircle, CheckCircle, Trash2, Edit2, Save } from 'lucide-react';

// Safely read & deserialize items from localStorage, guarding against SSR
// (no window/localStorage), absent keys, and corrupt JSON payloads.
function readItemsSafely() {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    try {
        const saved = window.localStorage.getItem('streamListItems');
        if (!saved) return [];
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
        console.error('Failed to parse streamListItems from localStorage:', err);
        return [];
    }
}

// Safely persist items to localStorage, guarding against SSR / quota errors.
function writeItemsSafely(items) {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
        window.localStorage.setItem('streamListItems', JSON.stringify(items));
    } catch (err) {
        console.error('Failed to write streamListItems to localStorage:', err);
    }
}

function StreamList() {
    const [inputVal, setInputVal] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');

    // Load saved items from localStorage
    const [items, setItems] = useState(readItemsSafely);

    // Save items to localStorage whenever the list changes
    useEffect(() => {
        writeItemsSafely(items);
    }, [items]);

    // Add new item to the list and clear input
    const handleAddItem = useCallback(
        (e) => {
            e.preventDefault();
            const trimmed = inputVal.trim();
            if (!trimmed) return;

            const newItem = {
                id: Date.now(),
                text: trimmed,
                completed: false,
            };

            // Functional update avoids stale-closure bugs if multiple
            // events batch before a re-render flushes `items`.
            setItems((prev) => [...prev, newItem]);
            setInputVal(''); // Clear user input upon submit
        },
        [inputVal]
    );

    // Toggle complete state
    const handleToggleComplete = useCallback((id) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, completed: !item.completed } : item
            )
        );
    }, []);

    // Delete item from list
    const handleDeleteItem = useCallback((id) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    }, []);

    // Start editing mode
    const handleStartEdit = useCallback((item) => {
        setEditingId(item.id);
        setEditText(item.text);
    }, []);

    // Save edited text
    const handleSaveEdit = useCallback(
        (id) => {
            const trimmed = editText.trim();
            // Guard against saving an empty/whitespace-only edit.
            if (!trimmed) return;

            setItems((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, text: trimmed } : item
                )
            );
            setEditingId(null);
            setEditText('');
        },
        [editText]
    );

    return (
        <div className="page-container">
            <h1>My Stream List</h1>
            <p>Manage your custom streaming watchlist below.</p>

            <form onSubmit={handleAddItem} className="stream-form">
                <input
                    type="text"
                    placeholder="Enter a movie or TV show title..."
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    required
                />
                <button type="submit" className="add-btn">
                    <PlusCircle size={18} /> Add Title
                </button>
            </form>

            {/* Display list of titles */}
            <div className="list-container">
                {items.length === 0 ? (
                    <p className="empty-message">No movies or programs added yet.</p>
                ) : (
                    <ul className="stream-list">
                        {items.map((item) => (
                            <li key={item.id} className={`list-item ${item.completed ? 'completed' : ''}`}>
                                {editingId === item.id ? (
                                    // Editing view
                                    <div className="edit-box">
                                        <input
                                            type="text"
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            aria-label="Edit title"
                                        />
                                        <button onClick={() => handleSaveEdit(item.id)} className="save-btn">
                                            <Save size={16} /> Save
                                        </button>
                                    </div>
                                ) : (
                                    // Normal view
                                    <>
                                        <span className="item-text">{item.text}</span>
                                        <div className="item-actions">
                                            <button
                                                onClick={() => handleToggleComplete(item.id)}
                                                className="complete-btn"
                                                title="Mark Complete"
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleStartEdit(item)}
                                                className="edit-btn"
                                                title="Edit Item"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteItem(item.id)}
                                                className="delete-btn"
                                                title="Delete Item"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default StreamList;