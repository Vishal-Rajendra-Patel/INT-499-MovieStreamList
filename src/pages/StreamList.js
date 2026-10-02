import React, { useState } from 'react';

function StreamList() {
    const [inputVal, setInputVal] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("User StreamList Input:", inputVal);
        setInputVal(''); // Clear input field
    };

    return (
        <div className="page-container">
            <h1>My Stream List</h1>
            <p>Add movie or program ideas to your personal watch list.</p>

            <form onSubmit={handleSubmit} className="stream-form">
                <input
                    type="text"
                    placeholder="Enter a movie or TV show..."
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    required
                />
                <button type="submit">Add to List</button>
            </form>
        </div>
    );
}

export default StreamList;