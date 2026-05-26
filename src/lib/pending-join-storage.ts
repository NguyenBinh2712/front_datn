const STORAGE_KEY = "datn-pending-join-groups";

export function getPendingJoinGroupIds(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const ids = JSON.parse(raw) as number[];
    return new Set(ids.filter((id) => Number.isFinite(id)));
  } catch {
    return new Set();
  }
}

export function addPendingJoinGroup(groupId: number) {
  const ids = getPendingJoinGroupIds();
  ids.add(groupId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

export function removePendingJoinGroup(groupId: number) {
  const ids = getPendingJoinGroupIds();
  ids.delete(groupId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}
