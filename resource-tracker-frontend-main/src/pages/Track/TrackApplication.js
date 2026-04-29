import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ─── Config ───────────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:8098"; // 👉 Change to your backend URL

// ─── Status Metadata ──────────────────────────────────────────────────────────
const STATUS_META = {
  APPLIED: {
    label: "Application Received",
    desc: "We have received your application and it is currently under review. You will be contacted soon.",
    step: 0,
  },
  SHORTLISTED: {
    label: "Shortlisted",
    desc: "Great news — you have been shortlisted! Our team will reach out to discuss next steps.",
    step: 1,
  },
  INTERVIEW: {
    label: "Interview Scheduled",
    desc: "You have been selected for an interview. Check your email for interview details and instructions.",
    step: 2,
  },
  SELECTED: {
    label: "Selected 🎉",
    desc: "Congratulations! You have been selected. Our HR team will contact you with the offer details.",
    step: 3,
  },
  REJECTED: {
    label: "Not Progressing",
    desc: "Thank you for your interest. After careful consideration, we have decided to move forward with other candidates. We encourage you to apply again in the future.",
    step: -1,
  },
  ON_HOLD: {
    label: "On Hold",
    desc: "Your application is currently on hold. We will be in touch once a decision has been made.",
    step: 1,
  },
};

const STEPS = [
  { key: "APPLIED",     label: "Applied"     },
  { key: "SHORTLISTED", label: "Shortlisted" },
  { key: "INTERVIEW",   label: "Interview"   },
  { key: "SELECTED",    label: "Selected"    },
];

const BADGE_STYLES = {
  APPLIED:     { background: "#e8edfb", color: "#1e4adb", dot: "#1e4adb" },
  SHORTLISTED: { background: "#fef3e2", color: "#b45309", dot: "#f59e0b" },
  INTERVIEW:   { background: "#f0fdf4", color: "#15803d", dot: "#22c55e" },
  SELECTED:    { background: "#e6f4ed", color: "#1a7a4a", dot: "#1a7a4a" },
  REJECTED:    { background: "#fee2e2", color: "#b91c1c", dot: "#b91c1c" },
  ON_HOLD:     { background: "#f1f5f9", color: "#475569", dot: "#94a3b8" },
};

// ─── Timeline Component ───────────────────────────────────────────────────────
function Timeline({ status }) {
  const meta       = STATUS_META[status] || { step: 0 };
  const isRejected = status === "REJECTED";

  if (isRejected) {
    return (
      <div style={{ display: "flex", marginBottom: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{
            width: 26, height: 26, borderRadius: "50%",
            border: "2px solid #b91c1c", background: "#fee2e2",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="#b91c1c" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6"  x2="6"  y2="18" />
              <line x1="6"  y1="6"  x2="18" y2="18" />
            </svg>
          </div>
          <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "#b91c1c", marginTop: 6 }}>
            Closed
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
      {STEPS.map((step, i) => {
        const done    = i < meta.step;
        const current = i === meta.step;
        return (
          <div key={step.key} style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            flex: 1, minWidth: 60, position: "relative",
          }}>
            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div style={{
                position: "absolute", top: 13, left: "50%",
                width: "100%", height: 2,
                background: done ? "#1e4adb" : "#e2ddd9", zIndex: 0,
              }} />
            )}
            {/* Dot */}
            <div style={{
              width: 26, height: 26, borderRadius: "50%", zIndex: 1,
              border: `2px solid ${done || current ? "#1e4adb" : "#e2ddd9"}`,
              background: done ? "#1e4adb" : current ? "#e8edfb" : "#f5f2ee",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: current ? "0 0 0 4px rgba(30,74,219,0.12)" : "none",
              transition: "all 0.3s",
            }}>
              {done ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24"
                  fill={current ? "#1e4adb" : "#6b6360"}>
                  <circle cx="12" cy="12" r="4" />
                </svg>
              )}
            </div>
            {/* Label */}
            <span style={{
              fontSize: "0.68rem",
              fontWeight: done || current ? 600 : 500,
              color: done || current ? "#1e4adb" : "#6b6360",
              marginTop: 6, textAlign: "center", whiteSpace: "nowrap",
            }}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── StatusBadge Component ────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const meta  = STATUS_META[status] || { label: status, desc: "" };
  const style = BADGE_STYLES[status] || BADGE_STYLES.APPLIED;

  return (
    <div style={{
      background: "#f5f2ee", border: "1px solid #e2ddd9",
      borderRadius: 12, padding: 20, marginBottom: 20,
    }}>
      <div style={{
        fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.07em",
        textTransform: "uppercase", color: "#6b6360", marginBottom: 10,
      }}>
        Current Status
      </div>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "7px 14px", borderRadius: 100,
        background: style.background, color: style.color,
        fontSize: "0.88rem", fontWeight: 600,
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: "50%",
          background: style.dot, display: "inline-block",
        }} />
        {meta.label}
      </div>
      <div style={{ marginTop: 10, fontSize: "0.83rem", color: "#6b6360", lineHeight: 1.5 }}>
        {meta.desc}
      </div>
    </div>
  );
}

// ─── Main TrackApplication Component ─────────────────────────────────────────
function TrackApplication() {
  const [token,      setToken]      = useState("");
  const [inputFocus, setInputFocus] = useState(false);
  const [data,       setData]       = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");

  const navigate = useNavigate();

  // Auto-fill token from URL query param (?token=xxx)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (t) {
      setToken(t);
      doFetch(t);
    }
  }, []);

  const doFetch = useCallback(async (overrideToken) => {
    const t = (overrideToken ?? token).trim();
    if (!t) { setError("Please enter your tracking ID."); return; }

    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch(`${API_BASE}/api/public/apply/track?token=${encodeURIComponent(t)}`);
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Invalid or expired tracking ID.");
      }
      const result = await res.json();
      setData(result);
    } catch (err) {
      setError(err.message || "Unable to fetch status. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleReset = () => {
    setData(null);
    setError("");
    setToken("");
  };

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      background: "#f5f2ee",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 16px",
      position: "relative",
    }}>

      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* Background glow */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background:
          "radial-gradient(circle at 20% 30%, rgba(30,74,219,0.06) 0%, transparent 50%), " +
          "radial-gradient(circle at 80% 80%, rgba(30,74,219,0.04) 0%, transparent 45%)",
      }} />

      <div style={{ width: "100%", maxWidth: 520, position: "relative", zIndex: 1 }}>

        {/* ── Brand ── */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <a href="https://www.irayitsolutions.com/"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{
              width: 36, height: 36, background: "#1e4adb", borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <span style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "1.2rem", color: "#1a1614", letterSpacing: "-0.02em",
            }}>
              I-Ray IT Solutions
            </span>
          </a>
        </div>

        {/* ── Entry Card (shown when no data yet) ── */}
        {!data && (
          <div style={{
            background: "#fff", borderRadius: 14,
            border: "1px solid #e2ddd9",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)", overflow: "hidden",
          }}>
            {/* Card Header */}
            <div style={{ padding: "32px 32px 24px", borderBottom: "1px solid #e2ddd9" }}>
              <h1 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "1.65rem", color: "#1a1614",
                letterSpacing: "-0.02em", lineHeight: 1.2, margin: 0,
              }}>
                Track your application
              </h1>
              <p style={{ marginTop: 8, color: "#6b6360", fontSize: "0.9rem", lineHeight: 1.55 }}>
                Enter the tracking ID sent to your email to check the current status of your job application.
              </p>
            </div>

            {/* Card Body */}
            <div style={{ padding: 32 }}>

              {/* Token Input */}
              <div style={{ marginBottom: 20 }}>
                <label style={{
                  display: "block", fontSize: "0.8rem", fontWeight: 600,
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  color: "#6b6360", marginBottom: 8,
                }}>
                  Tracking ID
                </label>
                <div style={{ position: "relative" }}>
                  <svg style={{
                    position: "absolute", left: 14, top: "50%",
                    transform: "translateY(-50%)", width: 16, height: 16,
                    color: "#6b6360", pointerEvents: "none",
                  }} viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && doFetch()}
                    onFocus={() => setInputFocus(true)}
                    onBlur={() => setInputFocus(false)}
                    placeholder="e.g. 3f8a2c1d-4b7e-..."
                    autoComplete="off"
                    spellCheck={false}
                    style={{
                      width: "100%", padding: "12px 14px 12px 42px",
                      border: `1.5px solid ${inputFocus ? "#1e4adb" : "#e2ddd9"}`,
                      borderRadius: 10,
                      fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem",
                      color: "#1a1614", background: inputFocus ? "#fff" : "#f5f2ee",
                      outline: "none", letterSpacing: "0.02em", boxSizing: "border-box",
                      boxShadow: inputFocus ? "0 0 0 3px rgba(30,74,219,0.1)" : "none",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={() => doFetch()}
                disabled={loading}
                style={{
                  width: "100%", padding: "13px 20px",
                  background: loading ? "#6b9aed" : "#1e4adb",
                  color: "#fff", border: "none", borderRadius: 10,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.95rem", fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  transition: "background 0.15s",
                }}
              >
                {loading ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
                        <animateTransform attributeName="transform" type="rotate"
                          from="0 12 12" to="360 12 12" dur="0.7s" repeatCount="indefinite" />
                      </path>
                    </svg>
                    Checking…
                  </>
                ) : (
                  <>
                    <span>Check Status</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>

              {/* Error Message */}
              {error && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  marginTop: 14, background: "#fee2e2", color: "#b91c1c",
                  border: "1px solid #fca5a5", borderRadius: 8,
                  padding: "10px 14px", fontSize: "0.85rem", fontWeight: 500,
                }}>
                  <svg width="16" height="16" style={{ flexShrink: 0 }}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8"  x2="12"    y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Result Card (shown after successful fetch) ── */}
        {data && (
          <div style={{
            background: "#fff", borderRadius: 14,
            border: "1px solid #e2ddd9",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)", overflow: "hidden",
          }}>
            {/* Result Header */}
            <div style={{ padding: "32px 32px 24px", borderBottom: "1px solid #e2ddd9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: "#e8edfb",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="#1e4adb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <p style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "1.25rem", color: "#1a1614",
                    letterSpacing: "-0.01em", margin: 0,
                  }}>
                    {data.name}
                  </p>
                  <p style={{ fontSize: "0.85rem", color: "#6b6360", marginTop: 2 }}>
                    Applied for: {data.jobTitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Result Body */}
            <div style={{ padding: 32 }}>

              {/* Timeline */}
              <Timeline status={data.status} />

              {/* Status Badge */}
              <StatusBadge status={data.status} />

              {/* Job info chip */}
              {data.jobTitle && (
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "7px 12px", background: "#f5f2ee",
                    border: "1px solid #e2ddd9", borderRadius: 8,
                    fontSize: "0.8rem", color: "#6b6360",
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="#1e4adb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" />
                      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                    </svg>
                    {data.jobTitle}
                  </div>
                </div>
              )}

              {/* Action links */}
              <div style={{ display: "flex", gap: 20, marginTop: 24, alignItems: "center" }}>
                <button
                  onClick={handleReset}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    fontSize: "0.82rem", color: "#1e4adb", fontWeight: 500,
                    background: "none", border: "none", padding: 0, cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Track another application
                </button>

                {/* <button
                  onClick={() => navigate("/")}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    fontSize: "0.82rem", color: "#6b6360", fontWeight: 500,
                    background: "none", border: "none", padding: 0, cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Go to Home
                </button> */}
              </div>

            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <div style={{ textAlign: "center", marginTop: 28, fontSize: "0.78rem", color: "#6b6360" }}>
          Need help?{" "}
          <a href="mailto:hr@irayitsolutions.com"
            style={{ color: "#1e4adb", fontWeight: 500, textDecoration: "none" }}>
            Contact HR
          </a>
          {" · "}
          <a href="https://www.irayitsolutions.com/" target="_blank" rel="noreferrer"
            style={{ color: "#1e4adb", fontWeight: 500, textDecoration: "none" }}>
            Visit website
          </a>
        </div>

      </div>
    </div>
  );
}

export default TrackApplication;
