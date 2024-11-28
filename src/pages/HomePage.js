import React, { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs, updateDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../firebase";
import AddNoteForm from "../components/AddNoteForm";
import NoteCard from "../components/NoteCard";
import Pagination from "../components/Pagination";  // Import the Pagination component

const HomePage = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingNote, setEditingNote] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);  // State for current page
    const notesPerPage = 6;  // Set notes per page to 6

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const notesQuery = query(
                collection(db, "notes"),
                orderBy("createdAt", "desc")
            );
            const snapshot = await getDocs(notesQuery);
            const notesList = snapshot.docs
                .map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                .filter((note) => !note.deleted);  // Ensure we don't show deleted notes
            
            setNotes(notesList);  // Set notes state after fetching
            toast.success("Notes loaded successfully!");
        } catch (error) {
            console.error("Error fetching notes: ", error);
            toast.error("Failed to load notes. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const onPin = async (noteId) => {
        const note = notes.find((note) => note.id === noteId);
        if (note) {
            try {
                const noteDocRef = doc(db, "notes", noteId);
                await updateDoc(noteDocRef, {
                    pinned: !note.pinned,
                });
                fetchNotes();  // Re-fetch the notes to ensure they reflect changes
                toast.success(`Note ${note.pinned ? "unpinned" : "pinned"} successfully!`);
            } catch (error) {
                console.error("Error updating pinned state: ", error);
                toast.error("Failed to update pinned state. Please try again.");
            }
        }
    };

    const onDelete = async (noteId) => {
        try {
            await updateDoc(doc(db, "notes", noteId), {
                deleted: true,
            });
            fetchNotes();  // Re-fetch after deletion
            toast.success("Note deleted successfully!");
        } catch (error) {
            console.error("Error deleting note: ", error);
            toast.error("Failed to delete note. Please try again.");
        }
    };

    const onEdit = (note) => {
        setEditingNote(note);  // Set the note to be edited
    };

    const handleSaveEdit = async (editedNote) => {
        try {
            const noteDocRef = doc(db, "notes", editedNote.id);
            await updateDoc(noteDocRef, {
                title: editedNote.title,
                tagline: editedNote.tagline,
                body: editedNote.body,
                updatedAt: new Date(),
            });
            toast.success("Note updated successfully!");
            setEditingNote(null);  // Reset editing state
            fetchNotes();  // Re-fetch after editing
        } catch (error) {
            console.error("Error updating note: ", error);
            toast.error("Failed to update note. Please try again.");
        }
    };

    // Pagination logic
    const indexOfLastNote = currentPage * notesPerPage;
    const indexOfFirstNote = indexOfLastNote - notesPerPage;
    const currentNotes = notes.slice(indexOfFirstNote, indexOfLastNote);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);  // Change current page for pagination
    };

    useEffect(() => {
        fetchNotes();  // Fetch notes only once when component mounts
    }, []);

    return (
        <div>
            <AddNoteForm
                refreshNotes={fetchNotes}  // Pass the fetchNotes function to AddNoteForm
                notes={notes}
                editingNote={editingNote}
                handleSaveEdit={handleSaveEdit}
            />
            {loading ? (
                <p>Loading notes...</p>
            ) : notes.length > 0 ? (
                <div className="note-grid">
                    {currentNotes.map((note) => (
                        <NoteCard
                            key={note.id}
                            note={note}
                            onPin={onPin}
                            onDelete={onDelete}
                            onEdit={onEdit}
                        />
                    ))}
                </div>
            ) : (
                <p>No notes to display. Add a new note!</p>
            )}

            {/* Pagination Component */}
            <Pagination
                totalNotes={notes.length}
                notesPerPage={notesPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default HomePage;
