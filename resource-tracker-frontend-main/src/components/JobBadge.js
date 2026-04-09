import React from 'react';
import './JobBadge.css';

function JobBadge({ children, variant = 'default' }) {
  return <span className={`job-badge job-badge--${variant}`}>{children}</span>;
}

export default JobBadge;