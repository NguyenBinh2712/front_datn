import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMyGroups, fetchSuggestedGroups, searchGroups } from "@/api/group";
import { css } from "@/lib/styles";
import GroupCard from "@/components/group/groupCard";
import CreateGroupModal from "./create-group-modal";

export default function GroupsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  // 👉 tạm thời hardcode (vì backend chưa có hook user rõ ràng)
  const isTeacher = true;

  const mine = useQuery({
    queryKey: ["groups-mine"],
    queryFn: fetchMyGroups,
  });

  const suggested = useQuery({
    queryKey: ["groups-suggested"],
    queryFn: fetchSuggestedGroups,
    enabled: !keyword,
  });

  const searchResult = useQuery({
    queryKey: ["groups-search", keyword],
    queryFn: () => searchGroups(keyword, 20),
    enabled: keyword.trim().length > 1,
  });

  const joinedIds = new Set(mine.data?.map((g) => g.id) ?? []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyword(searchInput.trim());
  };

  return (
    <>
      <style>{css}</style>

      {showCreate && (
        <CreateGroupModal
          onClose={() => setShowCreate(false)}
          onCreated={() => mine.refetch()}
        />
      )}

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 16px" }}>
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 32,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "var(--accent)",
                letterSpacing: "0.1em",
              }}
            >
              CỘNG ĐỒNG HỌC TẬP
            </p>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 36,
                fontWeight: 900,
                margin: 0,
              }}
            >
              Nhóm của tôi
            </h1>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {/* SEARCH */}
            <form
              onSubmit={handleSearch}
              style={{
                display: "flex",
                border: "1px solid var(--border)",
                borderRadius: 8,
                overflow: "hidden",
                background: "var(--card)",
              }}
            >
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Tìm nhóm..."
                style={{
                  padding: "10px 16px",
                  border: "none",
                  background: "transparent",
                  width: 260,
                  fontSize: 14,
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "0 20px",
                  background: "var(--accent)",
                  color: "#fff",
                  border: "none",
                  fontWeight: 600,
                }}
              >
                Tìm
              </button>
            </form>

            {/* CREATE GROUP */}
            {isTeacher && (
              <button
                onClick={() => setShowCreate(true)}
                style={{
                  padding: "10px 20px",
                  background: "var(--accent)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                + Tạo nhóm
              </button>
            )}
          </div>
        </div>

        {/* CONTENT */}
        {keyword ? (
          <section>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
              Kết quả tìm kiếm cho "{keyword}"
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 16,
              }}
            >
              {searchResult.data?.map((g) => (
                <GroupCard
                  key={g.id}
                  group={g}
                  isJoined={joinedIds.has(g.id)}
                />
              ))}
            </div>
          </section>
        ) : (
          <>
            {/* MY GROUPS */}
            <section style={{ marginBottom: 60 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
                Nhóm đã tham gia
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: 16,
                }}
              >
                {mine.data?.map((g) => (
                  <GroupCard key={g.id} group={g} isJoined />
                ))}
              </div>
            </section>

            {/* SUGGESTED */}
            <section>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
                Gợi ý cho bạn
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: 16,
                }}
              >
                {suggested.data
                  ?.filter((g) => !joinedIds.has(g.id))
                  .map((g) => (
                    <GroupCard key={g.id} group={g} />
                  ))}
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
}
