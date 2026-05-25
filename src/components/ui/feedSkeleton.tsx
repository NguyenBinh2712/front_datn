export function FeedSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 120,
            borderRadius: 6,
            background: "var(--skeleton)",
            animation: "shimmer 1.4s infinite",
          }}
        />
      ))}
    </>
  );
}
