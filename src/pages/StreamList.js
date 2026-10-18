import React, { useState, useEffect } from 'react';
import { PlusCircle, CheckCircle, Trash2, Edit2, Save } from 'lucide-react';

function StreamList() {
    const [inputVal, setInputVal] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');

    // Load saved items from localStorage
    const [items, setItems] = useState(() => {
        const savedItems = localStorage.getItem('streamListItems');
        return savedItems ? JSON.parse(savedItems) : [];
    });

    // Save items to localStorage whenever the list changes
    useEffect(() => {
        localStorage.setItem('streamListItems', JSON.stringify(items));
    }, [items]);

    // Add new item to the list and clear input
    const handleAddItem = (e) => {
        e.preventDefault();
        if (!inputVal.trim()) return;

        const newItem = {
            id: Date.now(),
            text: inputVal,
            completed: false,
        };

        setItems([...items, newItem]);
        setInputVal(''); // Clear user input upon submit
    };

    // Toggle complete state
    const handleToggleComplete = (id) => {
        setItems(
            items.map((item) =>
                item.id === id ? { ...item, completed: !item.completed } : item
            )
        );
    };

    // Delete item from list
    const handleDeleteItem = (id) => {
        setItems(items.filter((item) => item.id !== id));
    };

    // Start editing mode
    const handleStartEdit = (item) => {
        setEditingId(item.id);
        setEditText(item.text);
    };

    // Save edited text
    const handleSaveEdit = (id) => {
        setItems(
            items.map((item) =>
                item.id === id ? { ...item, text: editText } : item
            )
        );
        setEditingId(null);
        setEditText('');
    };

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