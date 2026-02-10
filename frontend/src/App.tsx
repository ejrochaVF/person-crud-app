/**
 * APP COMPONENT
 * 
 * This is the root component of the React application
 * 
 * Responsibility:
 * - Render the main application structure
 * - Import and render PersonList component
 * 
 * In a larger app, this would handle:
 * - Routing (React Router)
 * - Global state management (Context API, Redux)
 * - Authentication
 * - Theme management
 */

import React from 'react';
import PersonList from './components/PersonList';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <PersonList />
      </div>
    </ErrorBoundary>
  );
}

export default App;
