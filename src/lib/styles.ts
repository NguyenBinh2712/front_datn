export const groupStyles = {
  modalTitle: {
    fontFamily: "var(--font-display)",
    fontSize: 20,
    fontWeight: 800,
    marginBottom: 24,
    marginTop: 0,
  } as React.CSSProperties,

  labelStyle: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  } as React.CSSProperties,

  labelText: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--text-muted)",
  } as React.CSSProperties,

  inputStyle: {
    width: "100%",
    padding: "9px 12px",
    borderRadius: 4,
    border: "1px solid var(--border)",
    background: "var(--bg)",
    color: "var(--text)",
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
  } as React.CSSProperties,

  cancelBtnStyle: {
    flex: 1,
    padding: "10px 0",
    borderRadius: 4,
    border: "1px solid var(--border)",
    background: "transparent",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    color: "var(--text-muted)",
  } as React.CSSProperties,

  submitBtnStyle: {
    flex: 2,
    padding: "10px 0",
    borderRadius: 4,
    border: "none",
    background: "var(--accent)",
    color: "var(--accent-fg)",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.04em",
  } as React.CSSProperties,
};

export const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
  
  :root {
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --accent: #0f62fe;
    --accent-fg: #fff;
    --danger: #da1e28;
    --muted: rgba(15,98,254,0.08);
    --cover-placeholder: linear-gradient(135deg,#1e3a5f,#0f62fe55);
    --skeleton: #f0f0f0;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --muted: rgba(100,149,255,0.15);
      --skeleton: #2a2a2a;
    }
  }

  body { font-family: var(--font-body); }

  @keyframes shimmer { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
`;
