# Kiến trúc và nguyên tắc sản phẩm

## Quyết định nền tảng

- Next.js App Router + TypeScript cho giao diện và logic phía server.
- Supabase Auth cho đăng nhập bằng tài khoản công ty.
- Supabase Postgres là nguồn dữ liệu duy nhất.
- Supabase Storage lưu ảnh; bucket avatar ở chế độ private.
- `localStorage` chỉ dành cho tùy chọn giao diện hoặc bản nháp, không phải dữ liệu chính.

## Phạm vi Phase 1

- Đăng nhập.
- Xem danh bạ và hồ sơ nhân viên.
- Tìm kiếm/lọc danh bạ.
- Chỉnh sửa hồ sơ bản thân.
- Khóa truy cập dữ liệu bằng Row Level Security.

Feed, comment, reaction, notification, report và admin UI chưa nằm trong Phase 1.

## Vai trò

- `user`: xem hồ sơ đang hoạt động và sửa hồ sơ bản thân.
- `moderator`: dành cho kiểm duyệt nội dung ở Phase 2.
- `admin`: quản lý tài khoản, phòng ban và nội dung ở Phase 4.

Role được lưu tách khỏi `profiles` để người dùng không thể tự nâng quyền khi sửa hồ sơ.

## Nguyên tắc dữ liệu

- Hồ sơ đã nghỉ việc chuyển sang `inactive`, không xóa ngay.
- User chỉ được cập nhật các cột hồ sơ an toàn đã cấp quyền.
- Email, trạng thái và role không thể chỉnh từ form hồ sơ.
- Ảnh avatar phải nằm trong thư mục mang ID của chính người dùng.
- Mọi thay đổi schema được lưu dưới dạng migration trong Git.
- Tất cả thời gian trong database dùng UTC; giao diện định dạng theo locale Việt Nam.

## Môi trường

- Không có biến Supabase: chạy dữ liệu demo, không ghi dữ liệu.
- Development: Supabase project dành riêng cho phát triển.
- Production: project và OAuth callback riêng; giới hạn tên miền email công ty.

## Hướng mở rộng

Phase 2 thêm `posts`, `post_media`, `comments`, `reactions` và soft delete. Phase 3 thêm `mentions`, `notifications`, chủ đề tuần và job nhắc sinh nhật. Phase 4 thêm `reports`, audit log và giao diện quản trị.
