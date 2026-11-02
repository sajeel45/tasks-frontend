import React, { useState, useEffect } from "react";

const PaginationComponent = ({
  onPageChange,
  onItemsPerPageChange,
  initialPage = 1,
  initialItemsPerPage = 10,
  totalItems = 0,
  paginationLimit,
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  
  // Update local state when props change
  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  useEffect(() => {
    setItemsPerPage(initialItemsPerPage);
  }, [initialItemsPerPage]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    onPageChange(page);
  };

  const handleItemsPerPageChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setItemsPerPage(newLimit);
    onItemsPerPageChange(newLimit);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // If we have fewer pages than our max visible, show all
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      // Complex logic for showing pages around current page
      if (currentPage <= 3) {
        pageNumbers.push(2, 3);
        pageNumbers.push("...");
        pageNumbers.push(totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push("...");
        pageNumbers.push(totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push("...");
        pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination-container">
      <div className="pagination-controls">
        <button 
          className="pagination-arrow" 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <span className="pagination-arrow-icon">←</span>
        </button>
        
        <div className="pagination-numbers">
          {getPageNumbers().map((number, index) => (
            number === "..." ? (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
            ) : (
              <button
                key={`page-${number}`}
                className={`pagination-number ${currentPage === number ? 'active' : ''}`}
                onClick={() => handlePageChange(number)}
                aria-label={`Page ${number}`}
                aria-current={currentPage === number ? "page" : null}
              >
                {number}
              </button>
            )
          ))}
        </div>
        
        <button 
          className="pagination-arrow" 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <span className="pagination-arrow-icon">→</span>
        </button>
      </div>
      
      <div className="pagination-info">
        <div className="pagination-status">
          Showing <span className="highlight">{Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}</span> - <span className="highlight">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="highlight">{totalItems}</span> items
        </div>
        
        <div className="pagination-per-page">
          <label htmlFor="items-per-page">Items per page:</label>
          <select 
            id="items-per-page"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            aria-label="Number of items per page"
          >
            {[5, 10, 25, 50, 100].map(value => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default PaginationComponent;