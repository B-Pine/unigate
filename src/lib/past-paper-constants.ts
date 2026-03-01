export const LEVELS = ["Primary", "O-Level", "A-Level"] as const;

export const SUBJECTS_BY_LEVEL: Record<string, string[]> = {
  Primary: ["SET", "English", "Kinyarwanda", "Math", "Social Studies"],
  "O-Level": [
    "English",
    "Kinyarwanda",
    "Math",
    "History",
    "Geography",
    "Physics",
    "Chemistry",
    "Entrepreneurship",
    "Biology",
  ],
  "A-Level": [
    "English",
    "Kinyarwanda",
    "Math",
    "History",
    "Geography",
    "Physics",
    "Chemistry",
    "Entrepreneurship",
    "Biology",
    "Economics",
    "Computer Science",
  ],
};
