# Nhà Mình

Ứng dụng nội bộ giúp nhân viên tìm hiểu đồng nghiệp, cập nhật hồ sơ và chuẩn bị nền tảng cho feed giao lưu.

## Hiện có

- Trang chủ và danh bạ nhân viên responsive.
- Tìm kiếm theo tên, chức vụ, phòng ban và sở thích.
- Trang hồ sơ chi tiết.
- Form cập nhật hồ sơ có kiểm tra dữ liệu phía server.
- Đăng nhập Google hoặc magic link qua Supabase.
- Giới hạn tên miền email ở callback.
- Database migration, Row Level Security và bucket avatar riêng tư.
- Chế độ demo tự động khi chưa cấu hình Supabase.

## Chạy local

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`. Nếu chưa có `.env.local`, ứng dụng dùng dữ liệu demo và không ghi dữ liệu.

## Kết nối Supabase

1. Tạo project Supabase.
2. Sao chép `.env.example` thành `.env.local` và điền URL cùng publishable key.
3. Đặt `ALLOWED_EMAIL_DOMAIN` thành tên miền công ty, hoặc để trống nếu dùng allowlist bên Supabase.
4. Chạy migration trong `supabase/migrations` và seed `supabase/seed.sql` bằng Supabase CLI hoặc SQL Editor.
5. Bật Google OAuth hoặc Email OTP trong Supabase Auth và thêm URL callback `/auth/callback`.

Không đưa secret key hoặc service-role key vào biến `NEXT_PUBLIC_*`.

## Kiểm tra

```bash
npm run lint
npm run build
```
