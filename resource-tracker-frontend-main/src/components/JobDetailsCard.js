import React from 'react';
import JobBadge from './JobBadge';
import './JobDetailsCard.css';

// ─── Currency symbol map ──────────────────────────────────────────────────────
const CURRENCY_SYMBOLS = {
  INR: "₹",
  SEK: "kr",
  USD: "$",
};

function formatPayment(paymentRaw, paymentType) {
  if (!paymentRaw) return null;

  const parts = paymentRaw.trim().split(" ");
  const amount = parts[0];
  const currencyCode = parts[1] || "INR";

  if (!amount || isNaN(Number(amount))) return null;

  const symbol    = CURRENCY_SYMBOLS[currencyCode] || currencyCode;
  const formatted = Number(amount).toLocaleString("en-IN");
  const type      = paymentType ? ` / ${paymentType}` : "";

  if (currencyCode === "SEK") return `${formatted} ${symbol}${type}`;
  return `${symbol}${formatted}${type}`;
}

// ─── Map job status → badge variant ──────────────────────────────────────────
function getStatusVariant(status) {
  switch ((status || '').toUpperCase()) {
    case 'ACTIVE':
    case 'OPEN':
      return 'green';
    case 'TERMINATED':
    case 'CLOSED':
      return 'red';
    case 'ON_HOLD':
    case 'PAUSED':
      return 'yellow';
    case 'DRAFT':
      return 'gray';
    default:
      return 'green';
  }
}

function JobDetailsCard({ opening }) {
  const skills = opening.skill
    ? opening.skill.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const isTerminated = (opening.status || '').toUpperCase() === 'TERMINATED';

  return (
    <div className="jd-card">
      <div className="jd-card__header">
        <div className="jd-card__title-group">
          <span className="jd-card__tag">#{opening.technology}</span>
          <h1 className="jd-card__title">{opening.name}</h1>
        </div>
        <JobBadge variant={getStatusVariant(opening.status)}>
          {opening.status}
        </JobBadge>
      </div>

      <div className="jd-card__meta">
        {opening.location        && <MetaItem icon="📍" label={opening.location} />}
        {opening.employementtype && <MetaItem icon="💼" label={opening.employementtype} />}
        {opening.hours           && <MetaItem icon="⏱"  label={`${opening.hours} hrs/day`} />}
        {opening.shiftTimings    && <MetaItem icon="🕐" label={opening.shiftTimings} />}
        {formatPayment(opening.payment, opening.paymentType) && (
          <MetaItem icon="💰" label={formatPayment(opening.payment, opening.paymentType)} />
        )}
        {opening.experience > 0 && (
          <MetaItem icon="🎓" label={`${opening.experience} yrs experience`} />
        )}
      </div>

      {opening.description && (
        <div className="jd-card__description">
          {opening.description.split('\n').filter(line => line.trim() !== '').map((line, i) => {
            const isHeading =
              line.trim().endsWith(':') ||
              (line.trim().length < 40 &&
                !/[,.]/.test(line) &&
                line.trim() === line.trim().replace(/^\s*[-•]\s*/, ''));
            return isHeading ? (
              <p key={i} style={{ fontWeight: '700', color: '#1e3a5f', margin: '12px 0 4px 0', fontSize: '0.92rem' }}>
                {line.trim()}
              </p>
            ) : (
              <ul key={i} style={{ margin: '0 0 2px 0', paddingLeft: '18px', listStyleType: 'disc' }}>
                <li style={{ marginBottom: '4px' }}>{line.trim()}</li>
              </ul>
            );
          })}
        </div>
      )}

      {skills.length > 0 && (
        <div className="jd-card__skills">
          <span className="jd-card__skills-label">Required Skills</span>
          <div className="jd-card__skills-list">
            {skills.map((skill) => (
              <JobBadge key={skill} variant="accent">{skill}</JobBadge>
            ))}
          </div>
        </div>
      )}

      {/* ── Closed banner shown inline when job is terminated ── */}
      {isTerminated && (
        <div className="jd-card__closed-banner">
          <p className="jd-card__closed-banner-title">This position is closed</p>
          <p className="jd-card__closed-banner-sub">
            Applications are no longer being accepted for this role.
          </p>
        </div>
      )}
    </div>
  );
}

function MetaItem({ icon, label }) {
  return (
    <div className="jd-meta-item">
      <span>{icon}</span>
      <span className="jd-meta-item__text">{label}</span>
    </div>
  );
}

export default JobDetailsCard;