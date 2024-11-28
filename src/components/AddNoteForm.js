import React, { useState } from "react";
import {
    collection,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    serverTimestamp,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../firebase";
import "../App.css";

const AddNoteForm = ({ refreshNotes, notes }) => {
    const [title, setTitle] = useState("");
    const [tagline, setTagline] = useState("");
    const [body, setBody] = useState("");
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false); // Track if editing
    const [currentNoteId, setCurrentNoteId] = useState(null); // Track current note being edited

    const handleAddOrUpdateNote = async (e) => {
        e.preventDefault();

        if (!title || !tagline || !body) {
            toast.error("Please fill in all fields!");
            return;
        }

        setLoading(true);

        try {
            if (editing) {
                // Update an existing note
                const noteRef = doc(db, "notes", currentNoteId);
                await updateDoc(noteRef, {
                    title,
                    tagline,
                    body,
                    updatedAt: serverTimestamp(),
                });

                toast.success("Note updated successfully!");
                setEditing(false); // Reset editing state
                setCurrentNoteId(null);
            } else {
                // Add a new note
                await addDoc(collection(db, "notes"), {
                    title,
                    tagline,
                    body,
                    createdAt: serverTimestamp(),
                    pinned: false,
                });

                toast.success("Note added successfully!");
            }

            setTitle("");
            setTagline("");
            setBody("");
            refreshNotes();
        } catch (error) {
            console.error("Error saving note: ", error);
            toast.error("Failed to save note. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteNote = async (noteId) => {
        if (!window.confirm("Are you sure you want to delete this note?")) return;

        try {
            await deleteDoc(doc(db, "notes", noteId));
            toast.success("Note deleted successfully!");
            refreshNotes();
        } catch (error) {
            console.error("Error deleting note: ", error);
            toast.error("Failed to delete note. Please try again.");
        }
    };

    const handleEditNote = (note) => {
        setTitle(note.title);
        setTagline(note.tagline);
        setBody(note.body);
        setEditing(true);
        setCurrentNoteId(note.id);
    };

    return (
        <div>
            <form className="add-note-form" onSubmit={handleAddOrUpdateNote}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={loading}
                />
                <input
                    type="text"
                    placeholder="Tagline"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    disabled={loading}
                />
                <textarea
                    placeholder="Body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    disabled={loading}
                ></textarea>
                <button type="submit" disabled={loading}>
                    {loading
                        ? editing
                            ? "Updating..."
                            : "Adding..."
                        : editing
                        ? "Update Note"
                        : "Add Note"}
                </button>
                {editing && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditing(false);
                            setTitle("");
                            setTagline("");
                            setBody("");
                            setCurrentNoteId(null);
                        }}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                )}
            </form>

            <div className="note-grid">
                {notes.map((note) => (
                    <div className="note-card" key={note.id}>
                        <h3>{note.title}</h3>
                        <p>{note.tagline}</p>
                        <p>{note.body}</p>
                        <div className="note-actions">
                            <button onClick={() => handleEditNote(note)}>Edit</button>
                            <button onClick={() => handleDeleteNote(note.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AddNoteForm;
