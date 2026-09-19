DROP TABLE IF EXISTS users;

-- Table Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    birth_day VARCHAR(50),
    gender VARCHAR(10),
    role VARCHAR(50),
    avatar VARCHAR(500),
    deleted_by INTEGER NOT NULL DEFAULT 0,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Admin account
INSERT INTO users (
    name,
    email,
    password,
    phone,
    birth_day,
    gender,
    avatar,
    role,
    deleted_by,
    is_deleted,
    created_at,
    updated_at
) VALUES (
    'Admin',
    'admin@gmail.com',
    '$2b$10$wR2xC7s0m4D0Gg4k9hW6qeLZufYz/TKhgV6BdPcyf8UQd5I1c/32G',
    '0123456789',
    '2003-01-10',
    'Male',
    'https://res.cloudinary.com/dczjneexr/image/upload/v1758479133/images/lzsb0hcsu6wn41pzjowp.jpg',
    'admin',
    0,
    FALSE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);


DROP TABLE IF EXISTS lixi_sessions;

-- Table Lixi Sessions (dữ liệu phiên QR trong DonateCarousel)
CREATE TABLE lixi_sessions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,       -- 'lx01', 'lx02', ...
    name VARCHAR(255) NOT NULL,             -- tên hiển thị @name
    tagline VARCHAR(255) NOT NULL,
    bank VARCHAR(100) NOT NULL,
    account VARCHAR(50) NOT NULL,
    owner VARCHAR(255) NOT NULL,            -- chủ tài khoản
    content VARCHAR(255) NOT NULL,          -- nội dung chuyển khoản gợi ý
    qr VARCHAR(500) NOT NULL,               -- URL/path ảnh QR
    avatar VARCHAR(500) NOT NULL,           -- URL/path ảnh đại diện
    sort_order INTEGER NOT NULL DEFAULT 0,  -- thứ tự hiển thị trong carousel
    deleted_by INTEGER NOT NULL DEFAULT 0,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)

DROP TABLE IF EXISTS feedbacks;

-- Table Feedbacks
CREATE TABLE feedbacks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('bug', 'feature_request', 'improvement', 'general')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    deleted_by INTEGER NOT NULL DEFAULT 0,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO lixi_sessions (code, name, tagline, bank, account, owner, content, qr, avatar, sort_order) VALUES
('lx02', 'Hương Nếp', 'Trực mứt gừng, thích số tròn', 'ACB', '9988776655', 'Hương Nếp', 'Lì xì Hương Nếp - [Tên của bạn]', '/lixi/qr/huong.jpg', '/lixi/user/huong.jpg', 1),
('lx03', 'Minh Hiếu', 'Ca tối: lau nhà, lau luôn sao kê', 'MB Bank', '888999000', 'Minh Hiếu', 'Lì xì Minh Hiếu - [Tên của bạn]', '/lixi/qr/hieu2.jpg', '/lixi/user/hieu.jpg', 2),
('lx04', 'Hải Yến', 'Check bill trước khi mở bao', 'VPBank', '5566778899', 'Hải Yến', 'Lì xì Hải Yến - [Tên của bạn]', '/lixi/qr/yen.jpg', '/lixi/user/yen.jpg', 3),
('lx05', 'Anh Phú', 'Lì xì đổi lại lời chúc thơm', 'Sacombank', '3344556677', 'Anh Phú', 'Lì xì Anh Phú - [Tên của bạn]', '/lixi/qr/phu.jpg', '/lixi/user/phu.jpg', 4),
('lx06', 'A Tứn', 'Tư vấn phong thủy số tài khoản', 'BIDV', '6677889900', 'Tứn Mai', 'Lì xì Tứn Mai - [Tên của bạn]', '/lixi/qr/khay.jpg', '/lixi/user/khay.jpg', 5),
('lx07', 'Hiếu Bến Tàu', 'Ca đêm: đếm tiền lì xì thay bạn', 'TPBank', '111222333', 'Hiếu Bến Tàu', 'Lì xì Hiếu Bến Tàu - [Tên của bạn]', '/lixi/qr/hieu.jpg', '/lixi/user/hieuava.jpg', 6),
('lx08', 'Đôn Chủng', 'Chủ nhiệm câu lạc bộ hành phi', 'VietinBank', '909090123', 'Đôn Chủng', 'Lì xì Đôn Chủng - [Tên của bạn]', '/lixi/qr/chung.jpg', '/lixi/user/chung.jpg', 7),
('lx09', 'wem.hai', 'Chủ nhiệm câu lạc bộ hành hạ', 'VietinBank', '909090123', 'Hái Chỉ', 'Lì xì Đôn Chủng - [Tên của bạn]', '/lixi/qr/hai.jpg', '/lixi/user/hai.jpg', 8),
('lx10', 'A Pha', 'Cầm đầu mấy thằng em quận 12', 'VietinBank', '909090123', 'Hái Chỉ', 'Lì xì Cho T - [Tên của bạn]', '/lixi/qr/hieu.jpg', '/lixi/user/apha.jpg', 9),
('lx11', 'A kHanG', 'Chủ nhiệm câu lạc bộ hành hạ', 'VietinBank', '909090123', 'Hái Chỉ', 'Lì xì Đôn Chủng - [Tên của bạn]', '/lixi/qr/hai.jpg', '/lixi/user/user04.jpg', 10),
('lx01', 'Phong Lá', 'Chuyên viên gói lá dong full option', 'Techcombank', '2233445566', 'Phong Lá', 'Lì xì Phong Lá - [Tên của bạn]', '/lixi/qr/hieu.jpg', '/lixi/user/phong.jpg', 11);
