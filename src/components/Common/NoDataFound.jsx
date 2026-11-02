import React from 'react';
import { FiDatabase } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const NoDataFound = ({ 
  title = "No Data Found", 
  message = "There are no items to display at the moment.", 
  icon = <FiDatabase size={48} />,
  actionText = null,
  actionLink = null,
  actionHandler = null,
  isSearchResult = false
}) => {
  return (
    <div className="no-data-found">
      <div className="no-data-icon">
        {icon}
      </div>
      <h3 className="no-data-title">{title}</h3>
      <p className="no-data-message">{message}</p>
      
      {(actionText && (actionLink || actionHandler)) && (
        <div className="no-data-action">
          {actionLink ? (
            <Link to={actionLink} className="btn-action">
              {actionText}
            </Link>
          ) : (
            <button onClick={actionHandler} className="btn-action">
              {actionText}
            </button>
          )}
        </div>
      )}
      
      {isSearchResult && (
        <div className="search-suggestions">
          <h4>Suggestions:</h4>
          <ul>
            <li>Check your spelling</li>
            <li>Try more general keywords</li>
            <li>Try different keywords</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default NoDataFound;