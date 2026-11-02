import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, ListGroup } from 'react-bootstrap';
import { FiSearch } from 'react-icons/fi';
import { ApiRequests } from '../service/ApiRequests';
import personImg from '../assets/images/doctor-profile-img.jpg';
import { getId } from '../utils/gloabalFunctions';

const NewChatModal = ({ show, onHide, onChatCreated }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (show) {
      fetchUsers();
    }
  }, [show]);

  useEffect(() => {
    if (users.length > 0) {
      const filtered = users.filter(user => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const role = user.role?.toLowerCase() || '';
        const searchLower = searchTerm.toLowerCase();
        
        return fullName.includes(searchLower) || role.includes(searchLower);
      });
      setFilteredUsers(filtered);
    }
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    setSearchLoading(true);
    try {
      // Fetch both doctors and other users that can be chatted with
      const response = await ApiRequests.getPatients({limit: 1000});
      setUsers(response.data.results || response.data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleStartChat = async () => {
    if (selectedUser) {
      try {
        // Instead of creating a chat record, just pass the selected user
        // The actual conversation will be created when the first message is sent
        if (onChatCreated) {
          onChatCreated(selectedUser);
        }
        onHide();
        setSelectedUser(null);
        setSearchTerm('');
      } catch (error) {
        console.error('Failed to start chat:', error);
      }
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleClose = () => {
    setSelectedUser(null);
    setSearchTerm('');
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Start New Chat</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Form.Group className="mb-3">
          <div className="search-bar-wrapper position-relative">
            <Form.Control
              type="text"
              placeholder="Search users by name or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="search-icon position-absolute" style={{
              right: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6c757d'
            }} />
          </div>
        </Form.Group>

        {searchLoading ? (
          <div className="text-center p-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading users...</span>
            </div>
          </div>
        ) : (
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {filteredUsers.length === 0 ? (
              <div className="text-center p-4">
                <p className="text-muted">
                  {searchTerm ? 'No users found matching your search' : 'No users available'}
                </p>
              </div>
            ) : (
              <ListGroup variant="flush">
                {filteredUsers.map((user) => (
                  <ListGroup.Item
                    key={getId(user)}
                    action
                    active={getId(selectedUser) === getId(user)}
                    onClick={() => handleUserSelect(user)}
                    className="d-flex align-items-center p-3"
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="me-3">
                      <img
                        src={user.profileImage || personImg}
                        alt={`${user.firstName} ${user.lastName}`}
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.target.src = personImg;
                        }}
                      />
                    </div>
                    
                    <div className="flex-grow-1">
                      <h6 className="mb-1">
                        {user.role === 'doctor' ? 'Dr. ' : ''}{user.firstName} {user.lastName}
                      </h6>
                      <p className="mb-1 text-muted small">
                        {user.specialization || user.role || 'User'}
                      </p>
                      {user.experience && (
                        <small className="text-muted">
                          {user.experience} years experience
                        </small>
                      )}
                    </div>
                    
                    <div className="text-end">
                      {user.isOnline && (
                        <span className="badge bg-success rounded-pill">Online</span>
                      )}
                      {user.rating && (
                        <div className="small text-muted">
                          ⭐ {user.rating}/5
                        </div>
                      )}
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </div>
        )}
      </Modal.Body>
      
      <Modal.Footer>
        <button className="btn-style rounded transparent" onClick={handleClose}>
          Cancel
        </button>
        <button 
          className="btn-style rounded"
          onClick={handleStartChat}
          disabled={!selectedUser}
        >
          Start Chat
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewChatModal;
