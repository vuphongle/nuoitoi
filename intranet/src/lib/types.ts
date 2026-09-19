export type UserRole = "user" | "moderator" | "admin";

export type Employee = {
  id: string;
  slug: string;
  fullName: string;
  initials: string;
  avatarUrl: string | null;
  email: string;
  jobTitle: string;
  departmentId: string | null;
  department: string;
  location: string;
  bio: string;
  interests: string[];
  joinedDate: string;
  status: "active" | "inactive";
  role: UserRole;
  accent: "coral" | "mint" | "amber" | "blue" | "violet" | "rose";
};

export type Department = {
  id: string;
  name: string;
  description: string;
};
