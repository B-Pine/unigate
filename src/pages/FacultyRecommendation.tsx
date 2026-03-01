import { PublicLayout } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useCombinations, useFacultiesByCombination } from "@/hooks/use-combinations";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

const FacultyRecommendation = () => {
  const [selected, setSelected] = useState<string>("");
  const [searchCode, setSearchCode] = useState<string>("");

  const { data: combinations, isLoading: loadingCombinations } = useCombinations();
  const { data: facultyData, isLoading: loadingFaculties } = useFacultiesByCombination(searchCode);

  const handleCheck = () => {
    if (selected) {
      setSearchCode(selected);
    }
  };

  return (
    <PublicLayout>
      <div className="uni-page-header">
        <div className="uni-container">
          <div className="uni-breadcrumb">
            <Link to="/">Home</Link> / Faculty Recommendation
          </div>
          <h1>Faculty Recommendation</h1>
          <p>Hitamo combination wize high school ubone faculty wakwiga muri University</p>
        </div>
      </div>

      <div className="uni-page-content">
        <div className="uni-container">
          {/* Search form */}
          <div className="uni-card" style={{ maxWidth: 500, marginBottom: 32 }}>
            <div className="uni-card-body">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <Search size={16} style={{ color: "hsl(216, 64%, 28%)" }} />
                <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>Find Your Faculty</span>
              </div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#4b5563", marginBottom: 6 }}>
                High School Combination
              </label>
              <div className="flex gap-2">
                <Select value={selected} onValueChange={setSelected}>
                  <SelectTrigger className="flex-1 h-9 text-sm" style={{ borderColor: "#e5e7eb", borderRadius: 6 }}>
                    <SelectValue placeholder={loadingCombinations ? "Loading..." : "Select combination..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {(combinations || []).map((c) => (
                      <SelectItem key={c.id} value={c.code}>{c.code} &mdash; {c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleCheck}
                  disabled={!selected}
                  size="sm"
                  className="h-9 px-5"
                  style={{ borderRadius: 6 }}
                >
                  Search
                </Button>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loadingFaculties && searchCode && (
            <div style={{ color: "#6b7280", fontSize: 13, padding: "20px 0" }}>
              Loading faculties...
            </div>
          )}

          {/* Results */}
          {facultyData && facultyData.faculties && facultyData.faculties.length > 0 && (
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 16 }}>
                Recommended Faculties for{" "}
                <span style={{ color: "hsl(216, 64%, 28%)" }}>
                  {facultyData.combination?.code || searchCode}
                </span>
              </div>
              <div className="uni-list">
                {facultyData.faculties.map((faculty) => (
                  <div key={faculty.id} className="uni-list-item">
                    <div className="uni-list-title">{faculty.name}</div>
                    {faculty.description && (
                      <p className="uni-list-desc">{faculty.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {facultyData && facultyData.faculties && facultyData.faculties.length === 0 && !loadingFaculties && (
            <div style={{ color: "#6b7280", fontSize: 13, padding: "20px 0" }}>
              No faculties found for this combination.
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default FacultyRecommendation;
