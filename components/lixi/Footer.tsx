export function DisclaimerBar() {
  return (
    <div className="bg-[#1f1a17] px-2.5 py-3 text-center font-bold text-white">
      ⚠️ Nội dung chỉ để giải trí. Mọi liên hệ tới tiền bạc đều mang tính minh họa, vui lòng kèm
      theo chuyển khoản (đùa thôi).
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#fff7ed] py-7 pb-10 text-center text-[#6a5c55]">
      <div className="mx-auto w-[min(1180px,94vw)]">
        <div className="mb-2.5 flex flex-wrap justify-center gap-3">
          <a href="#dashboard" className="font-extrabold text-[#1f1a17]">
            Sao kê (đang cập nhật)
          </a>
          <a href="#heart" className="font-extrabold text-[#1f1a17]">
            Liên hệ
          </a>
          <a href="#donate" className="font-extrabold text-[#1f1a17]">
            Lì xì ngay
          </a>
        </div>
        <p className="my-1">Sản phẩm parody, minh bạch nhưng không nghiêm trọng hóa vấn đề.</p>
        <p className="my-1">© 2026 Lì Xì Thật Thà. Mọi quyền vui vẻ được bảo lưu.</p>
      </div>
    </footer>
  );
}
