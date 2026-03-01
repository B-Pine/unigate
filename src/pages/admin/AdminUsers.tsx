import { useEffect, useMemo, useState } from "react";
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from "@/hooks/use-users";
import { useAuth } from "@/contexts/AuthContext";

const emptyForm = { name: "", email: "", password: "", role: "student" };
type UserRow = { name: string; email: string; role: string; created_at: string; id?: number; tempId?: string; _dirty?: boolean };
type UserField = "name" | "email" | "role";

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const { data, isLoading } = useUsers({
    page,
    limit: 15,
    search: search || undefined,
    role: roleFilter || undefined,
  });
  const create = useCreateUser();
  const update = useUpdateUser();
  const remove = useDeleteUser();
  const { user } = useAuth();

  const [rows, setRows] = useState<UserRow[]>([]);
  const [createForm, setCreateForm] = useState(emptyForm);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeCell, setActiveCell] = useState<{ rowKey: string; field: UserField } | null>(null);
  const [isSavingRows, setIsSavingRows] = useState(false);
  const [dirtyCellKeys, setDirtyCellKeys] = useState<Set<string>>(new Set());
  const [saveProgress, setSaveProgress] = useState<{ current: number; total: number } | null>(null);

  useEffect(() => {
    setRows(
      (data?.data || []).map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        created_at: u.created_at || "",
        _dirty: false,
      }))
    );
    setActiveCell(null);
    setDirtyCellKeys(new Set());
    setSaveProgress(null);
  }, [data?.data, page]);

  const getRowKey = (row: UserRow) => (row.id ? `id-${row.id}` : `tmp-${row.tempId}`);
  const isRowComplete = (row: UserRow) => !!row.name.trim() && !!row.email.trim();

  const unsavedCount = useMemo(() => dirtyCellKeys.size, [dirtyCellKeys]);

  const updateRowField = (rowKey: string, field: keyof UserRow, value: string) => {
    setRows((prev) => prev.map((row) => (getRowKey(row) === rowKey ? { ...row, [field]: value, _dirty: true } : row)));
    setDirtyCellKeys((prev) => {
      const next = new Set(prev);
      next.add(`${rowKey}:${String(field)}`);
      return next;
    });
  };

  const clearDirtyForRow = (rowKey: string) => {
    setDirtyCellKeys((prev) => {
      const next = new Set<string>();
      prev.forEach((key) => {
        if (!key.startsWith(`${rowKey}:`)) next.add(key);
      });
      return next;
    });
  };

  const persistRow = async (row: UserRow, force = false) => {
    if ((!row._dirty && !force) || !isRowComplete(row)) return;

    if (row.id) {
      await update.mutateAsync({ id: row.id, name: row.name, email: row.email, role: row.role });
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, _dirty: false } : r)));
      clearDirtyForRow(getRowKey(row));
      return;
    }

    await create.mutateAsync({ name: row.name, email: row.email, password: "changeme123", role: row.role });
    setRows((prev) => prev.filter((r) => r.tempId !== row.tempId));
    clearDirtyForRow(getRowKey(row));
  };

  const saveAllRows = async () => {
    const pendingRows = rows.filter((row) => row._dirty);
    if (pendingRows.length === 0) return;

    const savableRows = pendingRows.filter((row) => isRowComplete(row));
    const incompleteCount = pendingRows.length - savableRows.length;
    if (savableRows.length === 0) {
      window.alert("No complete edited rows to save yet.");
      return;
    }

    setIsSavingRows(true);
    setSaveProgress({ current: 0, total: savableRows.length });
    try {
      for (let index = 0; index < savableRows.length; index++) {
        const row = savableRows[index];
        await persistRow(row, true);
        setSaveProgress({ current: index + 1, total: savableRows.length });
      }
      if (incompleteCount > 0) {
        window.alert(`${incompleteCount} edited row(s) were not saved because required fields are incomplete.`);
      }
    } catch {
      window.alert("Some rows failed to save. Please review and try again.");
    } finally {
      setIsSavingRows(false);
      setSaveProgress(null);
    }
  };

  const handleCreate = async () => {
    if (!createForm.name.trim() || !createForm.email.trim()) {
      window.alert("Name and email are required.");
      return;
    }
    if (createForm.password.length < 6) {
      window.alert("Password must be at least 6 characters.");
      return;
    }

    try {
      await create.mutateAsync({
        name: createForm.name,
        email: createForm.email,
        password: createForm.password,
        role: createForm.role,
      });
      setCreateForm(emptyForm);
      setShowCreateForm(false);
    } catch {
      window.alert("Failed to create user. Please check the form and try again.");
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this user?")) remove.mutate(id);
  };

  const startEdit = (rowKey: string, field: UserField) => {
    setActiveCell({ rowKey, field });
  };

  const endEdit = async (rowKey: string) => {
    setActiveCell(null);
  };

  const inputStyle = { width: "100%", height: 30, fontSize: 12, border: "1px solid #d4d7dd", borderRadius: 0, padding: "0 8px", backgroundColor: "#fff" };
  const cellTextStyle = {
    width: "100%",
    minHeight: 30,
    lineHeight: "30px",
    padding: "0 8px",
    fontSize: 12,
    whiteSpace: "nowrap" as const,
    overflow: "hidden" as const,
    textOverflow: "ellipsis" as const,
    cursor: "pointer",
  };
  const isSaving = isSavingRows || create.isPending || update.isPending;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "hsl(0,0%,20%)" }}>Users</h2>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button className="action-btn" onClick={() => setShowCreateForm((prev) => !prev)}>
            {showCreateForm ? "Close Form" : "Add New"}
          </button>
          <button className="action-btn" disabled>
            {unsavedCount > 0 ? `Unsaved Edits (${unsavedCount})` : "No Unsaved Changes"}
          </button>
          <button className="action-btn" onClick={saveAllRows} disabled={isSaving}>
            {isSaving ? `Saving ${saveProgress?.current || 0}/${saveProgress?.total || 0}...` : "Save"}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <input
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          placeholder="Filter by name or email"
          style={{ ...inputStyle, height: 32, maxWidth: 320 }}
        />
        <select
          value={roleFilter}
          onChange={(e) => {
            setPage(1);
            setRoleFilter(e.target.value);
          }}
          style={{ ...inputStyle, height: 32, width: 140 }}
        >
          <option value="">All Roles</option>
          <option value="student">student</option>
          <option value="admin">admin</option>
        </select>
      </div>

      {showCreateForm && (
        <div className="form-section" style={{ marginBottom: 12, backgroundColor: "#fff" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8 }}>
            <input placeholder="Name *" value={createForm.name} onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))} style={inputStyle} />
            <input placeholder="Email *" value={createForm.email} onChange={(e) => setCreateForm((prev) => ({ ...prev, email: e.target.value }))} style={inputStyle} />
            <input placeholder="Password * (min 6)" type="password" value={createForm.password} onChange={(e) => setCreateForm((prev) => ({ ...prev, password: e.target.value }))} style={inputStyle} />
            <select value={createForm.role} onChange={(e) => setCreateForm((prev) => ({ ...prev, role: e.target.value }))} style={inputStyle}>
              <option value="student">student</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <div style={{ marginTop: 8 }}>
            <button className="action-btn" onClick={handleCreate} disabled={create.isPending}>
              {create.isPending ? "Creating..." : "Add User"}
            </button>
          </div>
        </div>
      )}

      <div style={{ border: "1px solid #e0e0e0", borderRadius: 2, overflow: "hidden", backgroundColor: "#fff" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table" style={{ minWidth: 600, tableLayout: "fixed", width: "100%" }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((__, j) => (
                      <td key={j}>
                        <div style={{ height: 14, backgroundColor: "hsl(220,14%,93%)", borderRadius: 2, width: "75%" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", color: "hsl(0,0%,50%)", padding: 20 }}>
                    No users found
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  const rowKey = getRowKey(row);
                  const isNewRow = !row.id;
                  return (
                    <tr key={rowKey}>
                      <td>
                        {isNewRow || (activeCell?.rowKey === rowKey && activeCell.field === "name") ? (
                          <input autoFocus value={row.name} onChange={(e) => updateRowField(rowKey, "name", e.target.value)} onBlur={() => endEdit(rowKey)} style={inputStyle} />
                        ) : (
                          <div style={cellTextStyle} title={row.name} onClick={() => startEdit(rowKey, "name")}>{row.name || "\u2014"}</div>
                        )}
                      </td>
                      <td>
                        {isNewRow || (activeCell?.rowKey === rowKey && activeCell.field === "email") ? (
                          <input autoFocus value={row.email} onChange={(e) => updateRowField(rowKey, "email", e.target.value)} onBlur={() => endEdit(rowKey)} style={inputStyle} />
                        ) : (
                          <div style={cellTextStyle} title={row.email} onClick={() => startEdit(rowKey, "email")}>{row.email || "\u2014"}</div>
                        )}
                      </td>
                      <td>
                        {isNewRow || (activeCell?.rowKey === rowKey && activeCell.field === "role") ? (
                          <select autoFocus value={row.role} onChange={(e) => updateRowField(rowKey, "role", e.target.value)} onBlur={() => endEdit(rowKey)} style={inputStyle}>
                            <option value="student">student</option>
                            <option value="admin">admin</option>
                          </select>
                        ) : (
                          <div style={cellTextStyle} title={row.role} onClick={() => startEdit(rowKey, "role")}>{row.role || "\u2014"}</div>
                        )}
                      </td>
                      <td>
                        <div style={{ ...cellTextStyle, cursor: "default" }}>
                          {row.created_at ? new Date(row.created_at).toLocaleDateString() : "\u2014"}
                        </div>
                      </td>
                      <td>
                        {row.id ? (
                          <button
                            className="action-btn-danger"
                            onClick={() => handleDelete(row.id!)}
                            disabled={row.id === user?.id}
                          >
                            Delete
                          </button>
                        ) : (
                          <span style={{ color: "hsl(0,0%,60%)" }}>{"\u2014"}</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {data?.page && data?.totalPages && data.totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 16 }}>
          <button className="action-btn" disabled={data.page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span style={{ fontSize: 13, color: "hsl(0,0%,50%)" }}>Page {data.page} of {data.totalPages}</span>
          <button className="action-btn" disabled={data.page >= data.totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}
