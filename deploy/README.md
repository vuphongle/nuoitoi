# Chạy production bằng systemd và Caddy

- URL: https://saoke.laztar.xyz
- Frontend: `saoke.service`, nghe tại `127.0.0.1:3000`.
- Backend: `saoke-backend.service`, nghe tại `127.0.0.1:3069`.
- Bản đang chạy: `/opt/saoke/current`, symlink tới một thư mục trong `/opt/saoke/releases/`.
- Hai ứng dụng chạy bằng user `saoke`, tự khởi động cùng server và khởi động lại khi gặp lỗi.
- Biến môi trường: `/etc/saoke/frontend.env` và `/etc/saoke/backend.env`, quyền `0600`, owner `root`.
- Caddy: `/etc/caddy/Caddyfile`, dùng block trong `deploy/Caddyfile`; giữ các domain hiện có.

## Cập nhật mã nguồn

Chạy tại thư mục repo với quyền root. Cần Node.js 22, npm, rsync, Git, systemd và `flock`.
Script dùng pnpm `10.34.7` qua npx, không cần cài pnpm toàn cục.

```bash
git switch main
git pull --ff-only origin main
bash deploy/deploy.sh
```

Script cài dependency theo lockfile, build cả hai ứng dụng, chép vào một thư mục release mới,
cập nhật file service và chuyển symlink `current` trước khi restart. Các bản cũ được giữ lại.
Nếu khởi động hoặc kiểm tra frontend/API thất bại, script khôi phục symlink và file service cũ rồi restart.
Lỗi build không ảnh hưởng bản đang chạy. Mỗi lần chỉ có một tiến trình triển khai được phép chạy.

Frontend dùng `/etc/saoke/frontend.env` cho cả build và runtime, bao gồm:

```dotenv
BE_API_URL=http://127.0.0.1:3069/api
AUTH_SESSION_SECRET=<chuỗi ngẫu nhiên riêng cho production>
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_APP_URL=https://saoke.laztar.xyz
```

Backend dùng `/etc/saoke/backend.env`, theo các biến trong `backend/.env.example`.
File môi trường không được đưa vào Git hoặc thư mục release.
Các biến `NEXT_PUBLIC_*` được đóng vào bundle khi build; đổi các biến này cần chạy lại script.
Script không sửa Caddy và không chạy migration database.

## Quản lý

```bash
systemctl status saoke saoke-backend caddy
systemctl restart saoke-backend saoke
journalctl -u saoke -u saoke-backend -f
curl --fail http://127.0.0.1:3069/api/health
curl --fail --location --head https://saoke.laztar.xyz/
```

## Cài trên server mới

Tạo user và thư mục cấu hình, sau đó điền hai file môi trường trước khi triển khai:

```bash
useradd --system --home-dir /opt/saoke --shell /usr/sbin/nologin saoke
install -d -m 0755 /opt/saoke
install -d -m 0700 /etc/saoke
install -m 0600 /dev/null /etc/saoke/frontend.env
install -m 0600 /dev/null /etc/saoke/backend.env
```

Chạy `bash deploy/deploy.sh`, thêm block `deploy/Caddyfile` vào `/etc/caddy/Caddyfile`, rồi:

```bash
caddy validate --config /etc/caddy/Caddyfile
systemctl enable --now caddy
systemctl reload caddy
```

DNS phải trỏ tới server; cổng 80/443 phải truy cập được để Caddy cấp và gia hạn HTTPS.
Khi chuyển từ bản triển khai cũ ở `/opt/saoke/frontend` và `/opt/saoke/backend`, script tự nhận diện
và giữ chúng làm bản dự phòng cho lần triển khai đầu tiên.

## Kiểm tra script

```bash
bash -n deploy/deploy.sh
node --test deploy/deploy.test.mjs
```

Các test dùng thư mục tạm và giả lập build/systemd, kiểm tra chép file, loại file bí mật,
kích hoạt release, xử lý lỗi build và khôi phục khi health check thất bại.
