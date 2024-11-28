import React from 'react';

const Pagination = ({ totalNotes, notesPerPage, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalNotes / notesPerPage);

    return (
        <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
                <button
                    key={index}
                    className={index + 1 === currentPage ? "active" : ""}
                    onClick={() => onPageChange(index + 1)}
                >
                    {index + 1}
                </button>
            ))}
        </div>
    );
};

export default Pagination;
