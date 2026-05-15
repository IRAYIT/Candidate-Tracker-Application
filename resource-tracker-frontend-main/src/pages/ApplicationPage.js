import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchOpeningByKey } from '../api/jobApi';
import JobDetailsCard from '../components/JobDetailsCard';
import ApplicationForm from '../components/ApplicationForm';
import './ApplicationPage.css';

// ─── Company Name by Country ──────────────────────────────────────────────────
const COMPANY_BY_COUNTRY = {
  "India":  "I-Ray IT Solutions",
  "Sweden": "I-Ray IT Solutions AB",
  "USA":    "I-Ray IT Solutions INC",
};

// ─── Country Code by Location ─────────────────────────────────────────────────
const COUNTRY_CODE_BY_LOCATION = {
  "India":  "IN",
  "Sweden": "SE",
  "USA":    "US",
};

function getCompanyName(country) {
  return COMPANY_BY_COUNTRY[country] || "I-Ray IT Solutions";
}

function getCountryCode(location) {
  return COUNTRY_CODE_BY_LOCATION[location] || "IN";
}

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

  // ── Derive company name and country code from opening location ──
  const companyName = getCompanyName(opening?.location);
  const countryCode = getCountryCode(opening?.location);

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
          <span className="ap-header__brand">{companyName}</span>
          <span className="ap-header__divider" />
          <span className="ap-header__label">Career Portal</span>
        </header>
        <JobDetailsCard opening={opening} />
        <ApplicationForm publicUrlKey={publicUrlKey} country={countryCode} />
        <footer className="ap-footer">
          <p>© {new Date().getFullYear()} {companyName} · Resource Tracker</p>
        </footer>
      </div>
    </div>
  );
}

export default ApplicationPage;