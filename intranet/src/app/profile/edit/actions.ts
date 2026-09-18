"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createSupabaseServerClient, hasSupabaseEnv } from "@/lib/supabase/server";

const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Tên cần ít nhất 2 ký tự.").max(80, "Tên quá dài."),
  jobTitle: z.string().trim().min(2, "Hãy nhập chức vụ.").max(80, "Chức vụ quá dài."),
  departmentId: z.string().uuid("Phòng ban không hợp lệ."),
  location: z.string().trim().min(2, "Hãy nhập địa điểm.").max(80, "Địa điểm quá dài."),
  bio: z.string().trim().max(280, "Lời giới thiệu tối đa 280 ký tự."),
  interests: z.string().trim().max(180, "Danh sách sở thích quá dài."),
  joinedDate: z.iso.date("Ngày gia nhập không hợp lệ."),
});

export type ProfileFormState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function saveProfile(
  _previousState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
    jobTitle: formData.get("jobTitle"),
    departmentId: formData.get("departmentId"),
    location: formData.get("location"),
    bio: formData.get("bio"),
    interests: formData.get("interests"),
    joinedDate: formData.get("joinedDate"),
  });

  if (!parsed.success) {
    return { success: false, message: "Kiểm tra lại các trường được đánh dấu.", errors: parsed.error.flatten().fieldErrors };
  }

  if (!hasSupabaseEnv()) {
    return {
      success: true,
      message: "Bản demo đã kiểm tra dữ liệu hợp lệ. Kết nối Supabase để lưu thay đổi cho mọi người.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    return { success: false, message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." };
  }

  const interests = parsed.data.interests
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      job_title: parsed.data.jobTitle,
      department_id: parsed.data.departmentId,
      location: parsed.data.location,
      bio: parsed.data.bio,
      interests,
      joined_date: parsed.data.joinedDate,
    })
    .eq("id", authData.user.id);

  if (error) return { success: false, message: `Không thể lưu hồ sơ: ${error.message}` };

  revalidatePath("/");
  revalidatePath("/employees");
  revalidatePath("/profile/edit");
  return { success: true, message: "Đã lưu hồ sơ của bạn." };
}
