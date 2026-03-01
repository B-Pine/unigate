import { useEffect, useMemo, useState } from "react";
import {
  useCombinations,
  useCreateCombination,
  useUpdateCombination,
  useDeleteCombination,
  useLinkedFaculties,
  useLinkFaculty,
  useUnlinkFaculty,
} from "@/hooks/use-combinations";
import { useFaculties, useCreateFaculty } from "@/hooks/use-faculties";

const emptyComboForm = { code: "", name: "" };
type ComboRow = { code: string; name: string; faculty_count: number; id?: number; tempId?: string; _dirty?: boolean };
type ComboField = "code" | "name";

export default function AdminFacultyFinder() {
  const { data: combos, isLoading } = useCombinations();
  const create = useCreateCombination();
  const update = useUpdateCombination();
  const remove = useDeleteCombination();

  const [rows, setRows] = useState<ComboRow[]>([]);
  const [createForm, setCreateForm] = useState(emptyComboForm);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeCell, setActiveCell] = useState<{ rowKey: string; field: ComboField } | null>(null);
  const [isSavingRows, setIsSavingRows] = useState(false);
  const [dirtyCellKeys, setDirtyCellKeys] = useState<Set<string>>(new Set());
  const [saveProgress, setSaveProgress] = useState<{ current: number; total: number } | null>(null);
  const [selectedComboId, setSelectedComboId] = useState<number | null>(null);

  useEffect(() => {
    setRows(
      (combos || []).map((c) => ({
        id: c.id,
        code: c.code,
        name: c.name,
        faculty_count: c.faculty_count,
        _dirty: false,
      }))
    );
    setActiveCell(null);
    setDirtyCellKeys(new Set());
    setSaveProgress(null);
  }, [combos]);

  const getRowKey = (row: ComboRow) => (row.id ? `id-${row.id}` : `tmp-${row.tempId}`);
  const isRowComplete = (row: ComboRow) => !!row.code.trim() && !!row.name.trim();

  const unsavedCount = useMemo(() => dirtyCellKeys.size, [dirtyCellKeys]);

  const updateRowField = (rowKey: string, field: ComboField, value: string) => {
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

  const persistRow = async (row: ComboRow, force = false) => {
    if ((!row._dirty && !force) || !isRowComplete(row)) return;

    const payload = { code: row.code.trim(), name: row.name.trim() };

    if (row.id) {
      await update.mutateAsync({ id: row.id, ...payload });
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, _dirty: false } : r)));
      clearDirtyForRow(getRowKey(row));
      return;
    }

    await create.mutateAsync(payload);
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
    if (!createForm.code.trim() || !createForm.name.trim()) {
      window.alert("Code and name are required.");
      return;
    }

    try {
      await create.mutateAsync({ code: createForm.code.trim(), name: createForm.name.trim() });
      setCreateForm(emptyComboForm);
      setShowCreateForm(false);
    } catch {
      window.alert("Failed to create combination. Please check the form and try again.");
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this combination?")) remove.mutate(id);
  };

  /* ---- Section B state ---- */
  const { data: linkedFaculties } = useLinkedFaculties(selectedComboId);
  const linkFaculty = useLinkFaculty();
  const unlinkFaculty = useUnlinkFaculty();
  const { data: allFaculties } = useFaculties();
  const createFaculty = useCreateFaculty();

  const [linkFacultyId, setLinkFacultyId] = useState<number | null>(null);
  const [newFacultyForm, setNewFacultyForm] = useState({ name: "", description: "" });

  const selectedComboName = useMemo(() => {
    if (selectedComboId === null) return "";
    const found = (combos || []).find((c) => c.id === selectedComboId);
    if (found) return found.name;
    const fromRow = rows.find((r) => r.id === selectedComboId);
    return fromRow ? fromRow.name : "";
  }, [selectedComboId, combos, rows]);

  const availableFaculties = useMemo(() => {
    if (!allFaculties || !linkedFaculties) return allFaculties || [];
    const linkedIds = new Set(linkedFaculties.map((f) => f.id));
    return allFaculties.filter((f) => !linkedIds.has(f.id));
  }, [allFaculties, linkedFaculties]);

  const handleLinkFaculty = () => {
    if (selectedComboId === null || linkFacultyId === null) return;
    linkFaculty.mutate({ combinationId: selectedComboId, facultyId: linkFacultyId });
    setLinkFacultyId(null);
  };

  const handleCreateAndLink = async () => {
    if (!newFacultyForm.name.trim() || selectedComboId === null) return;
    try {
      const result: any = await createFaculty.mutateAsync({
        name: newFacultyForm.name.trim(),
        description: newFacultyForm.description.trim() || undefined,
      });
      await linkFaculty.mutateAsync({ combinationId: selectedComboId, facultyId: result.id });
      setNewFacultyForm({ name: "", description: "" });
    } catch {
      window.alert("Failed to create and link faculty. Please try again.");
    }
  };

  /* ---- Styles ---- */
  const inputStyle = { width: "100%", height: 30, fontSize: 12, border: "1px solid #d4d7dd", borderRadius: 0, padding: "0 8px", backgroundColor: "#fff" };
  const textAreaStyle = { ...inputStyle, height: 60, padding: "6px 8px", resize: "none" as const };
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

  const startEdit = (rowKey: string, field: ComboField) => {
    setActiveCell({ rowKey, field });
  };

  const endEdit = () => {
    setActiveCell(null);
  };

  return (
    <div>
      {/* ==================== Section A: Combinations Table ==================== */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "hsl(0,0%,20%)" }}>Faculty Finder — Combinations</h2>
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

      {showCreateForm && (
        <div className="form-section" style={{ marginBottom: 12, backgroundColor: "#fff" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
            <input
              placeholder="Code *"
              value={createForm.code}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, code: e.target.value }))}
              style={inputStyle}
            />
            <input
              placeholder="Name *"
              value={createForm.name}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))}
              style={inputStyle}
            />
          </div>
          <div style={{ marginTop: 8 }}>
            <button className="action-btn" onClick={handleCreate} disabled={create.isPending}>
              {create.isPending ? "Creating..." : "Add Combination"}
            </button>
          </div>
        </div>
      )}

      <div style={{ border: "1px solid #e0e0e0", borderRadius: 2, overflow: "hidden", backgroundColor: "#fff" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table" style={{ minWidth: 500, tableLayout: "fixed", width: "100%" }}>
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Faculties</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 4 }).map((__, j) => (
                      <td key={j}>
                        <div style={{ height: 14, backgroundColor: "hsl(220,14%,93%)", borderRadius: 2, width: "75%" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", color: "hsl(0,0%,50%)", padding: 20 }}>
                    No combinations found
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  const rowKey = getRowKey(row);
                  const isNewRow = !row.id;
                  return (
                    <tr key={rowKey}>
                      {/* Code */}
                      <td>
                        {isNewRow || (activeCell?.rowKey === rowKey && activeCell.field === "code") ? (
                          <input
                            autoFocus
                            value={row.code}
                            onChange={(e) => updateRowField(rowKey, "code", e.target.value)}
                            onBlur={endEdit}
                            style={inputStyle}
                          />
                        ) : (
                          <div style={cellTextStyle} title={row.code} onClick={() => startEdit(rowKey, "code")}>
                            {row.code || "\u2014"}
                          </div>
                        )}
                      </td>
                      {/* Name */}
                      <td>
                        {isNewRow || (activeCell?.rowKey === rowKey && activeCell.field === "name") ? (
                          <input
                            autoFocus
                            value={row.name}
                            onChange={(e) => updateRowField(rowKey, "name", e.target.value)}
                            onBlur={endEdit}
                            style={inputStyle}
                          />
                        ) : (
                          <div style={cellTextStyle} title={row.name} onClick={() => startEdit(rowKey, "name")}>
                            {row.name || "\u2014"}
                          </div>
                        )}
                      </td>
                      {/* Faculties count (read-only) */}
                      <td>
                        <div style={{ ...cellTextStyle, cursor: "default" }}>{row.faculty_count}</div>
                      </td>
                      {/* Actions */}
                      <td>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          {row.id && (
                            <button
                              className="action-btn"
                              style={selectedComboId === row.id ? { backgroundColor: "hsl(216,64%,28%)", color: "#fff" } : undefined}
                              onClick={() => setSelectedComboId(row.id!)}
                            >
                              Manage
                            </button>
                          )}
                          {row.id ? (
                            <button className="action-btn-danger" onClick={() => handleDelete(row.id!)}>
                              Delete
                            </button>
                          ) : (
                            <span style={{ color: "hsl(0,0%,60%)" }}>{"\u2014"}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================== Section B: Faculty Management ==================== */}
      {selectedComboId !== null && (
        <div style={{ borderTop: "1px solid #e0e0e0", marginTop: 24, paddingTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "hsl(0,0%,20%)", margin: 0 }}>
              Faculties for {selectedComboName}
            </h3>
            <button className="action-btn" onClick={() => setSelectedComboId(null)}>
              Close
            </button>
          </div>

          {/* B1: Linked Faculties */}
          <div style={{ border: "1px solid #e0e0e0", borderRadius: 2, overflow: "hidden", backgroundColor: "#fff", marginBottom: 16 }}>
            <table className="data-table" style={{ width: "100%", tableLayout: "fixed" }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {!linkedFaculties || linkedFaculties.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center", color: "hsl(0,0%,50%)", padding: 20 }}>
                      No faculties linked yet
                    </td>
                  </tr>
                ) : (
                  linkedFaculties.map((f) => (
                    <tr key={f.id}>
                      <td>
                        <div style={{ ...cellTextStyle, cursor: "default" }}>{f.name}</div>
                      </td>
                      <td>
                        <div style={{ ...cellTextStyle, cursor: "default" }}>{f.description || "\u2014"}</div>
                      </td>
                      <td>
                        <button
                          className="action-btn-danger"
                          onClick={() => unlinkFaculty.mutate({ combinationId: selectedComboId!, facultyId: f.id })}
                        >
                          Unlink
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* B2: Link existing faculty */}
          <div className="form-section" style={{ marginBottom: 16, backgroundColor: "#fff" }}>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: "hsl(0,0%,30%)", margin: "0 0 8px" }}>Link Existing Faculty</h4>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <select
                value={linkFacultyId ?? ""}
                onChange={(e) => setLinkFacultyId(e.target.value ? Number(e.target.value) : null)}
                style={{ ...inputStyle, maxWidth: 300 }}
              >
                <option value="">Select a faculty...</option>
                {availableFaculties.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
              <button
                className="action-btn"
                onClick={handleLinkFaculty}
                disabled={linkFacultyId === null || linkFaculty.isPending}
              >
                {linkFaculty.isPending ? "Linking..." : "Link"}
              </button>
            </div>
          </div>

          {/* B3: Create new faculty & link */}
          <div className="form-section" style={{ backgroundColor: "#fff" }}>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: "hsl(0,0%,30%)", margin: "0 0 8px" }}>Create New Faculty & Link</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8, alignItems: "start" }}>
              <input
                placeholder="Name *"
                value={newFacultyForm.name}
                onChange={(e) => setNewFacultyForm((prev) => ({ ...prev, name: e.target.value }))}
                style={inputStyle}
              />
              <textarea
                placeholder="Description"
                value={newFacultyForm.description}
                onChange={(e) => setNewFacultyForm((prev) => ({ ...prev, description: e.target.value }))}
                style={textAreaStyle}
              />
              <button
                className="action-btn"
                onClick={handleCreateAndLink}
                disabled={!newFacultyForm.name.trim() || createFaculty.isPending || linkFaculty.isPending}
              >
                {createFaculty.isPending ? "Creating..." : "Create & Link"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
