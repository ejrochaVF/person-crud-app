/**
 * INDEX.JS - React Application Entry Point
 * 
 * This file is the entry point of the React application
 * 
 * What happens here:
 * 1. Import React and ReactDOM
 * 2. Import the root App component
 * 3. Render the App into the DOM (into the div with id="root")
 * 
 * ReactDOM.render() is how React takes over the HTML page
 * Everything inside <App /> is managed by React
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Get the root element from index.html
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');
const root = ReactDOM.createRoot(rootElement);

// Render the React app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// React.StrictMode:
// - Development tool that highlights potential problems
// - Doesn't render any visible UI
// - Activates additional checks and warnings
// - Only works in development mode, not production
