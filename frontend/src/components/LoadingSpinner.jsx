/**
 * LOADING SPINNER COMPONENT
 *
 * A reusable loading spinner with different sizes and styles.
 * Provides better visual feedback during loading states.
 */

import React from 'react';

const LoadingSpinner = ({
  size = 'medium',
  message = 'Loading...',
  fullScreen = false
}) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };

  const containerClass = fullScreen ? 'loading-fullscreen' : 'loading-container';

  return (
    <div className={containerClass}>
      <div className={`spinner ${sizeClasses[size]}`}></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;