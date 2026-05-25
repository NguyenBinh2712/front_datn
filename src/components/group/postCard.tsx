import { SmallBtn } from "../ui/smallBtn";
import type { PostResponse } from "@/types/models";

type PostCardProps = {
  post: PostResponse;
  canPin: boolean;
  onPin: (id: number) => void;
  onUnpin: (id: number) => void;
};

export default function PostCard({
  post,
  canPin,
  onPin,
  onUnpin,
}: PostCardProps) {
  const authorName = post.user?.fullName ?? `User #${post.user?.id ?? ""}`;
  const firstChar = post.user?.fullName?.[0]?.toUpperCase() ?? "U";

  return (
    <article
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: "16px 18px",
        position: "relative",
        transition: "border-color 0.2s",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "var(--muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 700,
            color: "var(--accent)",
            flexShrink: 0,
          }}
        >
          {firstChar}
        </div>

        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{authorName}</div>

          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {post.createdAt
              ? new Date(post.createdAt).toLocaleString("vi-VN")
              : ""}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <p style={{ fontSize: 14.5, lineHeight: 1.65, margin: "0 0 14px 0" }}>
        {post.content}
      </p>

      {/* MEDIA */}
      {post.medias?.length ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              post.medias.length === 1 ? "1fr" : "repeat(2, 1fr)",
            gap: 8,
            marginBottom: 14,
          }}
        >
          {post.medias.map((m, i) => (
            <img
              key={i}
              src={m.url}
              alt=""
              style={{
                width: "100%",
                borderRadius: 6,
                maxHeight: 280,
                objectFit: "cover",
              }}
            />
          ))}
        </div>
      ) : null}

      {/* REACTIONS SUMMARY (optional UI hook) */}
      {post.reactions && (
        <div
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            marginBottom: 10,
          }}
        >
          ❤️ Reactions:{" "}
          {Object.entries(post.reactions)
            .map(([k, v]) => `${k}:${v}`)
            .join(" · ")}
        </div>
      )}

      {/* PIN ACTIONS (NO BACKEND PIN FIELD) */}
      {canPin && (
        <div style={{ display: "flex", gap: 8 }}>
          <SmallBtn onClick={() => onPin(post.id)}>📌 Ghim bài</SmallBtn>

          {/* optional UI button (không cần backend field) */}
          <SmallBtn onClick={() => onUnpin(post.id)}>Bỏ ghim</SmallBtn>
        </div>
      )}
    </article>
  );
}
