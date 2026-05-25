export function GhostBtn({
  children,
  onClick,
  white,
  danger,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  white?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 14px",
        borderRadius: 4,
        border: `1px solid ${white ? "rgba(255,255,255,0.5)" : danger ? "var(--danger)" : "var(--border)"}`,
        background: "rgba(0,0,0,0.25)",
        backdropFilter: "blur(4px)",
        color: white ? "#fff" : danger ? "var(--danger)" : "var(--text)",
        fontSize: 12,
        fontWeight: 700,
        cursor: "pointer",
        letterSpacing: "0.04em",
      }}
    >
      {children}
    </button>
  );
}
