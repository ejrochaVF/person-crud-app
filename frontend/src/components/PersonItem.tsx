/**
 * PERSON ITEM COMPONENT
 * 
 * This is part of the PRESENTATION TIER - UI Layer
 * 
 * Responsibility:
 * - Display a single person's information
 * - Provide Edit and Delete buttons
 * - Handle user actions (pass to parent)
 * 
 * Props:
 * - person: Person object to display
 * - onEdit: Function to call when Edit is clicked
 * - onDelete: Function to call when Delete is clicked
 * 
 * Key Concepts:
 * - Presentational Component: Only displays data, no business logic
 * - Props: Receives data and functions from parent
 * - Event Handlers: Calls parent functions when user interacts
 */

import React from 'react';
import { Person } from '../services/personService';

interface PersonItemProps {
  person: Person;
  onEdit: (person: Person) => void;
  onDelete: (id: number) => void;
  isOptimistic?: boolean;
}

const PersonItem: React.FC<PersonItemProps> = ({ person, onEdit, onDelete, isOptimistic = false }) => {
  /**
   * Handle delete with confirmation
   * 
   * Best practice: Always confirm before delete
   */
  const handleDelete = () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${person.name} ${person.surname}?`
    );
    
    if (confirmDelete) {
      onDelete(person.id);
    }
  };

  return (
    <div className={`person-item ${isOptimistic ? 'optimistic' : ''}`}>
      {isOptimistic && (
        <div className="optimistic-indicator">
          <div className="optimistic-spinner"></div>
          <span>Updating...</span>
        </div>
      )}
      
      <div className="person-info">
        {/* Person Details */}
        <div className="person-header">
          <h3>{person.name} {person.surname}</h3>
        </div>
        
        <div className="person-details">
          <div className="detail-row">
            <span className="label">Email:</span>
            <span className="value">{person.email}</span>
          </div>
          
          <div className="detail-row">
            <span className="label">Phone:</span>
            <span className="value">{person.phone}</span>
          </div>
          
          <div className="detail-row">
            <span className="label">Address:</span>
            <span className="value">{person.address}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="person-actions">
        <button 
          className="btn btn-edit"
          onClick={() => onEdit(person)}
          title="Edit this person"
        >
          ✏️ Edit
        </button>
        
        <button 
          className="btn btn-delete"
          onClick={handleDelete}
          title="Delete this person"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default PersonItem;
