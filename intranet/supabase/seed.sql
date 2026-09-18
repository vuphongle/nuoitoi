insert into public.departments (id, name, description)
values
  ('11111111-1111-4111-8111-111111111111', 'Sản phẩm', 'Biến ý tưởng thành trải nghiệm hữu ích.'),
  ('22222222-2222-4222-8222-222222222222', 'Kỹ thuật', 'Xây nền tảng ổn định và dễ phát triển.'),
  ('33333333-3333-4333-8333-333333333333', 'Vận hành', 'Giữ mọi thứ chạy trơn tru mỗi ngày.'),
  ('44444444-4444-4444-8444-444444444444', 'Con người', 'Chăm sóc trải nghiệm của cả đội ngũ.'),
  ('55555555-5555-4555-8555-555555555555', 'Kinh doanh', 'Kết nối sản phẩm với đúng khách hàng.')
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description;
