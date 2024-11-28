import React from 'react';
import "../App.css";

const NoteCard = ({ note, onPin, onDelete, onEdit }) => {
    const handlePinToggle = () => {
        onPin(note.id);
    };
    const handleDelete = () => {
        onDelete(note.id);
    };
    return (
        <div className={`note-card ${note.pinned ? 'pinned' : ''}`}>
            <div className="note-actions">
                <button className="pin-button" onClick={handlePinToggle}>
                    {note.pinned ? '📍 Unpin' : '📌 Pin'}
                </button>
                <button className="delete-button" onClick={handleDelete}>
                    🗑️ Delete
                </button>
            </div>
            <h3>{note.title}</h3>
            <p>{note.tagline}</p>
            <p className="body-preview">{note.body.slice(0, 100)}...</p>
        </div>
    );
};

export default NoteCard;
