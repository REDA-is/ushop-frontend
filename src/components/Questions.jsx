import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";

/**
 * RecommendationWizard
 * Single-file, stylish, step-by-step questionnaire (one question at a time).
 * - Big, thumb-friendly Yes/No buttons
 * - Progress bar + smooth transitions
 * - Posts answers to /api/recommend and navigates to /recommendations
 * - No external CSS frameworks required (custom CSS below)
 */
export default function RecommendationWizard() {
  const navigate = useNavigate();

  // Define your questions here (order matters)
  const steps = useMemo(
    () => [
      { key: "wantsPump", label: "Do you want a strong pump for workouts?" },
      { key: "wantsToDry", label: "Are you looking to cut/dry (reduce fat)?" },
      { key: "isTired", label: "Do you often feel tired or low on energy?" },
      { key: "wantsToBulk", label: "Do you want to bulk (gain muscle mass)?" },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const [form, setForm] = useState({ wantsPump: 0, wantsToDry: 0, isTired: 0, wantsToBulk: 0 });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const percent = Math.round(((index) / steps.length) * 100);
  const current = steps[index];

  const handlePick = (value) => {
  if (busy) return;
  setForm((f) => ({ ...f, [current.key]: value }));

  setTimeout(() => {
    if (index < steps.length - 1) {
      setIndex((i) => i + 1);
    } else {
      // move to summary (index just past the last step)
      setIndex(steps.length);
    }
  }, 180);
};

  const goBack = () => {
    if (busy) return;
    setError("");
    setIndex((i) => (i > 0 ? i - 1 : i));
  };
  

  const submit = async () => {
  try {
    setBusy(true);
    setError("");

    // POST to your backend recommendation endpoint
    const { data: products } = await API.post("/api/recommend", form);

    // Navigate to results page with products + answers
    navigate("/recommendations", {
      state: { products, answers: form },
    });
  } catch (e) {
    // Prefer backend error message if available
    const msg =
      e?.response?.data?.message ||
      e?.message ||
      "Something went wrong";
    setError(msg);
  } finally {
    setBusy(false);
  }
};

  return (
    <div className="rw-wrap">
      <style>{css}</style>
      <div className="rw-bg" />

      <div className="rw-card" role="form" aria-labelledby="rw-title">
        <div className="rw-top">
          <h1 id="rw-title">Personalized recommendations</h1>
          <p className="rw-sub">Answer a few quick questions—one at a time.</p>

          <div className="rw-progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
            <div className="rw-progress-bar" style={{ width: `${percent}%` }} />
          </div>
          <div className="rw-progress-label">
            Step {Math.min(index + 1, steps.length)} / {steps.length}
          </div>
        </div>

        {/* Question stage */}
        {index < steps.length ? (
          <div className="rw-stage" key={current.key}>
            <div className="rw-question">{current.label}</div>

            <div className="rw-actions">
              <button
                type="button"
                className="rw-btn yes"
                onClick={() => handlePick(1)}
                aria-label="Yes"
              >
                Yes
              </button>
              <button
                type="button"
                className="rw-btn no"
                onClick={() => handlePick(0)}
                aria-label="No"
              >
                No
              </button>
            </div>

            <div className="rw-nav">
              <button type="button" className="rw-link" onClick={goBack} disabled={index === 0 || busy}>
                ← Back
              </button>
            </div>
          </div>
        ) : (
          // Summary + Submit
          <div className="rw-stage">
            <div className="rw-summary">
              <h2>All set!</h2>
              <p>Tap submit to get your tailored product list.</p>
              <ul>
                {steps.map((s) => (
                  <li key={s.key}>
                    <span>{s.label}</span>
                    <strong>{form[s.key] ? "Yes" : "No"}</strong>
                  </li>
                ))}
              </ul>
            </div>

            {error && <div className="rw-error">{error}</div>}

            <div className="rw-actions">
              <button type="button" className="rw-btn back" onClick={goBack} disabled={busy}>
                ← Edit answers
              </button>
              <button type="button" className="rw-btn submit" onClick={submit} disabled={busy}>
                {busy ? "Submitting…" : "Get recommendations"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const css = `
  :root{
    --bg1:#0f172a; /* slate-900 */
    --bg2:#1e293b; /* slate-800 */
    --card:#0b1022ee;
    --text:#e5e7eb;
    --muted:#9aa3b2;
    --accent:#22c55e; /* green-500 */
    --accent-2:#ef4444; /* red-500 */
    --outline:rgba(255,255,255,0.08);
  }
  .rw-wrap{min-height:100vh;display:grid;place-items:center;position:relative;overflow:hidden;color:var(--text);}
  .rw-bg{position:absolute;inset:0;background:radial-gradient(1200px 600px at 20% -10%, #22c55e22, transparent 60%),
                                   radial-gradient(900px 500px at 110% 20%, #60a5fa22, transparent 60%),
                                   linear-gradient(160deg, var(--bg1), var(--bg2));filter:saturate(120%);}  
  .rw-card{position:relative;z-index:1;width:min(760px, 92vw);background:var(--card);border:1px solid var(--outline);border-radius:20px;padding:28px 28px 32px;box-shadow:0 40px 120px rgba(0,0,0,0.45);}
  .rw-top{margin-bottom:18px}
  .rw-top h1{margin:0;font-size:28px;letter-spacing:.2px}
  .rw-sub{margin:6px 0 14px;color:var(--muted)}
  .rw-progress{height:8px;background:#121733;border:1px solid var(--outline);border-radius:999px;overflow:hidden}
  .rw-progress-bar{height:100%;background:linear-gradient(90deg, #22c55e, #86efac)}
  .rw-progress-label{margin-top:8px;color:var(--muted);font-size:12px}
  .rw-stage{margin-top:18px;animation:fade .24s ease}
  .rw-question{font-size:22px;margin:10px 0 18px;line-height:1.35}
  .rw-actions{display:flex;gap:14px;flex-wrap:wrap}
  .rw-btn{appearance:none;border:none;border-radius:14px;padding:14px 18px;font-weight:700;cursor:pointer;transition:transform .08s ease, box-shadow .2s ease, background .2s ease;outline:none}
  .rw-btn:disabled{opacity:.7;cursor:not-allowed}
  .rw-btn.yes{background:var(--accent);color:#04110a;box-shadow:0 8px 24px rgba(34,197,94,.35)}
  .rw-btn.no{background:#0f172a;color:#e2e8f0;border:1px solid var(--outline)}
  .rw-btn.back{background:#0f172a;color:#e2e8f0;border:1px solid var(--outline)}
  .rw-btn.submit{background:linear-gradient(90deg,#22c55e,#16a34a);color:#04110a;box-shadow:0 10px 28px rgba(34,197,94,.35)}
  .rw-btn:hover{transform:translateY(-1px)}
  .rw-nav{margin-top:14px}
  .rw-link{background:none;border:none;color:#9bd8ff;padding:0;cursor:pointer}
  .rw-summary h2{margin:0 0 8px;font-size:22px}
  .rw-summary p{margin:0 0 12px;color:var(--muted)}
  .rw-summary ul{list-style:none;padding:0;margin:8px 0 16px;display:grid;gap:8px}
  .rw-summary li{display:flex;justify-content:space-between;gap:12px;background:#0e1633;border:1px solid var(--outline);padding:10px 12px;border-radius:12px}
  .rw-error{margin:8px 0 0;color:#fecaca;background:#7f1d1d;border:1px solid #ef4444;padding:8px 12px;border-radius:10px}
  @keyframes fade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
`;
