import { useState } from "react";
import { updateGroupInfo } from "@/api/group";
import { Overlay } from "@/components/ui/overlay";
import { groupStyles } from "@/lib/styles";
import type { GroupResponse } from "@/types/models";

type EditGroupModalProps = {
  group: GroupResponse;
  onClose: () => void;
  onSaved: () => void;
};

type FormState = {
  name: string;
  description: string;
  privacy: "PUBLIC" | "PRIVATE";
};

export default function EditGroupModal({
  group,
  onClose,
  onSaved,
}: EditGroupModalProps) {
  const [form, setForm] = useState<FormState>({
    name: group.name,
    description: group.description ?? "",
    privacy: (group.privacy as "PUBLIC" | "PRIVATE") ?? "PRIVATE",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateGroupInfo(group.id, form);
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClose={onClose}>
      <h2 style={groupStyles.modalTitle}>Chỉnh sửa nhóm</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        <label style={groupStyles.labelStyle}>
          <span style={groupStyles.labelText}>Tên nhóm</span>
          <input
            style={groupStyles.inputStyle}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>

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
          />
        </label>

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
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </Overlay>
  );
}
