import React from 'react';
import { Spinner } from 'react-bootstrap';

interface LoadingSpinnerProps {
  size?: 'sm';
  variant?: string;
  text?: string;
  centered?: boolean;
  fullScreen?: boolean;
}

export function LoadingSpinner({ 
  size, 
  variant = 'primary', 
  text = 'Loading...', 
  centered = false,
  fullScreen = false 
}: LoadingSpinnerProps) {
  const content = (
    <div className={`d-flex align-items-center ${centered ? 'justify-content-center' : ''}`}>
      <Spinner animation="border" variant={variant} size={size} className="me-2" />
      <span className="text-muted">{text}</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75" style={{zIndex: 9999}}>
        {content}
      </div>
    );
  }

  if (centered) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        {content}
      </div>
    );
  }

  return content;
}