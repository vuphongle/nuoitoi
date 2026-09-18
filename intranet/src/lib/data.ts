import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { demoDepartments, demoEmployees } from "@/lib/demo-data";
import { createSupabaseServerClient, hasSupabaseEnv } from "@/lib/supabase/server";
import type { Department, Employee, UserRole } from "@/lib/types";

type ProfileRow = {
  id: string;
  slug: string;
  full_name: string;
  avatar_path: string | null;
  email: string;
  job_title: string | null;
  department_id: string | null;
  location: string | null;
  bio: string | null;
  interests: string[] | null;
  joined_date: string | null;
  status: "active" | "inactive";
  departments: { name: string } | { name: string }[] | null;
  user_roles: { role: UserRole } | { role: UserRole }[] | null;
};

const accents: Employee["accent"][] = ["coral", "mint", "amber", "blue", "violet", "rose"];

function initialsFromName(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function firstRelation<T>(value: T | T[] | null) {
  return Array.isArray(value) ? value[0] ?? null : value;
}

function mapProfile(row: ProfileRow, index = 0): Employee {
  const department = firstRelation(row.departments);
  const userRole = firstRelation(row.user_roles);

  return {
    id: row.id,
    slug: row.slug,
    fullName: row.full_name,
    initials: initialsFromName(row.full_name),
    avatarUrl: row.avatar_path,
    email: row.email,
    jobTitle: row.job_title || "Thành viên",
    departmentId: row.department_id,
    department: department?.name || "Chưa cập nhật",
    location: row.location || "Việt Nam",
    bio: row.bio || "Chưa có lời giới thiệu. Hãy ghé lại sau nhé!",
    interests: row.interests || [],
    joinedDate: row.joined_date || new Date().toISOString().slice(0, 10),
    status: row.status,
    role: userRole?.role || "user",
    accent: accents[index % accents.length],
  };
}

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

async function signAvatarPaths(client: SupabaseServerClient, rows: ProfileRow[]) {
  const paths = [...new Set(rows.map((row) => row.avatar_path).filter((path): path is string => Boolean(path)))];
  if (paths.length === 0) return rows;

  const { data } = await client.storage.from("avatars").createSignedUrls(paths, 60 * 60);
  const signedByPath = new Map(
    (data || [])
      .filter((item) => item.signedUrl)
      .map((item) => [item.path, item.signedUrl]),
  );

  return rows.map((row) => ({
    ...row,
    avatar_path: row.avatar_path ? signedByPath.get(row.avatar_path) || null : null,
  }));
}

export const getCurrentViewer = cache(async (): Promise<Employee | null> => {
  if (!hasSupabaseEnv()) {
    return demoEmployees[0];
  }

  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*, departments(name), user_roles(role)")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (!data) {
    const email = authData.user.email || "thanhvien@example.com";
    const fullName = authData.user.user_metadata.full_name || email.split("@")[0];
    return {
      ...demoEmployees[0],
      id: authData.user.id,
      slug: authData.user.id,
      fullName,
      initials: initialsFromName(fullName),
      email,
    };
  }

  const [profile] = await signAvatarPaths(supabase, [data as ProfileRow]);
  return mapProfile(profile);
});

export async function requireViewer() {
  const viewer = await getCurrentViewer();
  if (!viewer) redirect("/login");
  return viewer;
}

export const getEmployees = cache(async (): Promise<Employee[]> => {
  if (!hasSupabaseEnv()) return demoEmployees;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*, departments(name), user_roles(role)")
    .eq("status", "active")
    .order("full_name");

  if (error) throw new Error(`Không thể tải danh sách nhân viên: ${error.message}`);
  const profiles = await signAvatarPaths(supabase, data as ProfileRow[]);
  return profiles.map(mapProfile);
});

export const getDepartments = cache(async (): Promise<Department[]> => {
  if (!hasSupabaseEnv()) return demoDepartments;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("departments")
    .select("id, name, description")
    .order("name");

  if (error) throw new Error(`Không thể tải phòng ban: ${error.message}`);
  return data as Department[];
});

export const getEmployee = cache(async (identifier: string): Promise<Employee | null> => {
  if (!hasSupabaseEnv()) {
    return demoEmployees.find((item) => item.slug === identifier || item.id === identifier) || null;
  }

  const supabase = await createSupabaseServerClient();
  const column = /^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(identifier) ? "id" : "slug";
  const { data, error } = await supabase
    .from("profiles")
    .select("*, departments(name), user_roles(role)")
    .eq(column, identifier)
    .maybeSingle();

  if (error) throw new Error(`Không thể tải hồ sơ: ${error.message}`);
  if (!data) return null;
  const [profile] = await signAvatarPaths(supabase, [data as ProfileRow]);
  return mapProfile(profile);
});
