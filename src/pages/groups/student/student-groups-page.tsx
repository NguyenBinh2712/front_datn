import { useState, useMemo } from "react";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchMyGroups,
  fetchSuggestedGroups,
  searchGroups,
  syncPendingJoinGroupIds,
} from "@/api/group";
import { css } from "@/lib/styles";
import StudentGroupCard from "@/components/group/studentGroupCard";

export default function StudentGroupsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");

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

  const suggestedIds = useMemo(
    () =>
      suggested.data
        ?.filter((g) => !joinedIds.has(g.id))
        .map((g) => g.id) ?? [],
    [suggested.data, mine.data],
  );

  const searchIds = useMemo(
    () =>
      searchResult.data
        ?.filter((g) => !joinedIds.has(g.id))
        .map((g) => g.id) ?? [],
    [searchResult.data, mine.data],
  );

  const pendingJoin = useQuery({
    queryKey: [
      "my-pending-join-groups",
      keyword || "home",
      (keyword ? searchIds : suggestedIds).join(","),
    ],
    queryFn: () =>
      syncPendingJoinGroupIds(keyword ? searchIds : suggestedIds),
    enabled: keyword ? searchIds.length > 0 : suggestedIds.length > 0,
  });

  const pendingIds = new Set(pendingJoin.data ?? []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyword(searchInput.trim());
  };

  return (
    <>
      <style>{css}</style>

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
                <StudentGroupCard
                  key={g.id}
                  group={g}
                  isJoined={joinedIds.has(g.id)}
                  requestPending={pendingIds.has(g.id)}
                />
              ))}
            </div>
          </section>
        ) : (
          <>
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
                  <StudentGroupCard key={g.id} group={g} isJoined />
                ))}
              </div>
            </section>

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
                    <StudentGroupCard
                      key={g.id}
                      group={g}
                      requestPending={pendingIds.has(g.id)}
                    />
                  ))}
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
}
