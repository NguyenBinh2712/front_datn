import { useState } from "react";
import { createGroup } from "@/api/group";
import { Overlay } from "@/components/ui/overlay";
import { groupStyles } from "@/lib/styles";
import type { GroupCreateRequest } from "@/api/group";

type CreateGroupModalProps = {
  onClose: () => void;
  onCreated: () => void;
};

export default function CreateGroupModal({
  onClose,
  onCreated,
}: CreateGroupModalProps) {
  const [form, setForm] = useState<GroupCreateRequest>({
    name: "",
    description: "",
    privacy: "PRIVATE",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("Tên nhóm không được để trống");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await createGroup(form);
      onCreated();
      onClose();
    } catch (err) {
      setError("Tạo nhóm thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClose={onClose}>
      <h2 style={groupStyles.modalTitle}>Tạo nhóm mới</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        {/* NAME */}
        <label style={groupStyles.labelStyle}>
          <span style={groupStyles.labelText}>Tên nhóm *</span>
          <input
            style={groupStyles.inputStyle}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nhóm Toán 12A..."
          />
        </label>

        {/* DESCRIPTION */}
        <label style={groupStyles.labelStyle}>
          <span style={groupStyles.labelText}>Mô tả</span>
          <textarea
            style={{
              ...groupStyles.inputStyle,
              height: 80,
              resize: "vertical",
            }}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Mô tả về nhóm..."
          />
        </label>

        {/* PRIVACY */}
        <label style={groupStyles.labelStyle}>
          <span style={groupStyles.labelText}>Quyền riêng tư</span>
          <select
            style={groupStyles.inputStyle}
            value={form.privacy}
            onChange={(e) =>
              setForm({
                ...form,
                privacy: e.target.value as "PUBLIC" | "PRIVATE",
              })
            }
          >
            <option value="PRIVATE">Riêng tư</option>
            <option value="PUBLIC">Công khai</option>
          </select>
        </label>

        {/* ERROR */}
        {error && <p style={{ color: "var(--danger)", margin: 0 }}>{error}</p>}

        {/* BUTTONS */}
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button
            type="button"
            onClick={onClose}
            style={groupStyles.cancelBtnStyle}
          >
            Hủy
          </button>

          <button
            type="submit"
            disabled={loading}
            style={groupStyles.submitBtnStyle}
          >
            {loading ? "Đang tạo..." : "Tạo nhóm"}
          </button>
        </div>
      </form>
    </Overlay>
  );
}
