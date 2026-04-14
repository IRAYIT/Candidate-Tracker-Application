import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchOpeningByKey } from '../api/jobApi';
import JobDetailsCard from '../components/JobDetailsCard';
import ApplicationForm from '../components/ApplicationForm';
import './ApplicationPage.css';

function ApplicationPage() {
  const { publicUrlKey } = useParams();
  const [opening, setOpening] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchOpeningByKey(publicUrlKey);
        setOpening(data);
      } catch (err) {
        setError(err.message || 'Failed to load job details.');
      } finally {
        setLoading(false);
      }
    }
    if (publicUrlKey) load();
    else { setError('Invalid job link.'); setLoading(false); }
  }, [publicUrlKey]);

  if (loading) {
    return (
      <div className="ap-center">
        <div className="ap-loader">
          <div className="ap-loader__ring" />
          <span>Loading job details…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ap-center">
        <div className="ap-error-box">
          <span style={{fontSize:'2rem'}}>⚠</span>
          <h2>Oops!</h2>
          <p>{error}</p>
          <small>Please check the link or contact the hiring team.</small>
        </div>
      </div>
    );
  }

  return (
    <div className="ap-page">
      <div className="ap-blob ap-blob--1" />
      <div className="ap-blob ap-blob--2" />
      <div className="ap-container">
        <header className="ap-header">
          <span className="ap-header__brand">I-Ray IT Solutions</span>
          <span className="ap-header__divider" />
          <span className="ap-header__label">Career Portal</span>
        </header>
        <JobDetailsCard opening={opening} />
        <ApplicationForm publicUrlKey={publicUrlKey} />
        <footer className="ap-footer">
          <p>© {new Date().getFullYear()} I-Ray IT Solutions · Resource Tracker</p>
        </footer>
      </div>
    </div>
  );
}

export default ApplicationPage;