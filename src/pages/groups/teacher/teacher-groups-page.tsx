import { useState } from "react";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMyGroups, searchGroups } from "@/api/group";
import { css } from "@/lib/styles";
import TeacherGroupCard from "@/components/group/teacherGroupCard";
import CreateGroupModal from "../create-group-modal";

export default function TeacherGroupsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const mine = useQuery({
    queryKey: ["groups-mine"],
    queryFn: fetchMyGroups,
  });

  const searchResult = useQuery({
    queryKey: ["groups-search", keyword],
    queryFn: () => searchGroups(keyword, 20),
    enabled: keyword.trim().length > 1,
  });

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
                color: "#059669",
                letterSpacing: "0.1em",
              }}
            >
              QUẢN LÝ NHÓM HỌC TẬP
            </p>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 36,
                fontWeight: 900,
                margin: 0,
              }}
            >
              Nhóm giáo viên
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
                  background: "#059669",
                  color: "#fff",
                  border: "none",
                  fontWeight: 600,
                }}
              >
                Tìm
              </button>
            </form>

            <button
              onClick={() => setShowCreate(true)}
              style={{
                padding: "10px 20px",
                background: "#059669",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              + Tạo nhóm
            </button>
          </div>
        </div>

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
                <TeacherGroupCard key={g.id} group={g} />
              ))}
            </div>
          </section>
        ) : (
          <section>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
              Nhóm tôi quản lý
            </h2>
            {mine.data?.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>
                Chưa có nhóm nào. Bấm &quot;+ Tạo nhóm&quot; để bắt đầu.
              </p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: 16,
                }}
              >
                {mine.data?.map((g) => (
                  <TeacherGroupCard key={g.id} group={g} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </>
  );
}
