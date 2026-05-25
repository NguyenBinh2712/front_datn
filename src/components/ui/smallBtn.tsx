export function SmallBtn({
  children,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "4px 12px",
        borderRadius: 3,
        border: `1px solid ${danger ? "var(--danger)" : "var(--border)"}`,
        background: "transparent",
        color: danger ? "var(--danger)" : "var(--text)",
        fontSize: 11,
        fontWeight: 700,
        cursor: "pointer",
        letterSpacing: "0.04em",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = danger ? "var(--danger)" : "var(--muted)";
        if (danger) el.style.color = "#fff";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "transparent";
        if (danger) el.style.color = "var(--danger)";
      }}
    >
      {children}
    </button>
  );
}
