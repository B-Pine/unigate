export interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "admin";
  created_at?: string;
}

export interface Scholarship {
  id: number;
  title: string;
  university: string;
  country: string;
  description: string | null;
  requirements: string | null;
  deadline: string | null;
  form_link: string | null;
  image_url: string | null;
  audio_url: string | null;
  platform_link: string | null;
  status: "Open" | "Closed";
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: number;
  company: string;
  title: string;
  description: string | null;
  qualifications: string | null;
  experience_level: string | null;
  deadline: string | null;
  form_link: string | null;
  image_url: string | null;
  audio_url: string | null;
  platform_link: string | null;
  status: "Open" | "Closed";
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface Combination {
  id: number;
  code: string;
  name: string;
}

export interface Faculty {
  id: number;
  name: string;
  description: string | null;
}

export interface PastPaper {
  id: number;
  subject: string;
  year: number;
  level: string;
  category: "free" | "paid";
  file_path: string;
  original_filename: string;
  answer_file_path: string | null;
  answer_original_filename: string | null;
  uploaded_by: number;
  created_at: string;
}

export interface TimeSlot {
  id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

export interface AdviceSession {
  id: number;
  user_id: number;
  time_slot_id: number;
  reason: string;
  status: "Pending" | "Approved" | "Completed" | "Rejected";
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  day_of_week?: string;
  start_time?: string;
  end_time?: string;
  user_name?: string;
  user_email?: string;
}

export interface Bookmark {
  id: number;
  user_id: number;
  item_type: "scholarship" | "job";
  item_id: number;
  created_at: string;
  item?: Partial<Scholarship> | Partial<Job> | null;
}

export interface AdminStats {
  users: number;
  scholarships: number;
  jobs: number;
  pastPapers: number;
  timeSlots: number;
  sessions: number;
  pendingSessions: number;
}

export interface Payment {
  id: number;
  user_id: number;
  screenshot_path: string;
  screenshot_filename: string;
  screenshot_url?: string;
  status: "pending" | "approved" | "rejected";
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields (admin view)
  user_name?: string;
  user_email?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}
