export function Heart() {
  return (
    <section id="heart" className="bg-[#fff7ed] py-20 scroll-mt-27.5">
      <div className="mx-auto grid w-[min(1180px,94vw)] gap-4 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
        <div className="rounded-[18px] border border-black/6 bg-white p-4.5 shadow-[0_24px_60px_rgba(215,38,61,0.12)]">
          <h2 className="mb-2.5">Lời nhắn từ trái tim</h2>
          <p className="my-2.5">
            Trang này chỉ để giải trí và lan tỏa vibe minh bạch. Chúng tôi ghi lại mọi khoản thu chi bằng thái độ vui
            vẻ, tôn trọng người gửi và không đụng chạm ai.
          </p>
          <p className="my-2.5">
            Chúc bạn một mùa Tết rực rỡ, nhiều bao lì xì và nhiều tiếng cười. Cảm ơn vì đã xem, đã donate, đã góp ý.
          </p>
        </div>
        <div className="rounded-[18px] border border-[#f6c344]/40 bg-[#fff7e1] p-4.5 shadow-[0_24px_60px_rgba(215,38,61,0.12)]">
          <h3 className="mb-2.5">Disclaimer vui</h3>
          <p className="my-2.5">
            Nội dung chỉ để giải trí, không phải kêu gọi từ thiện nghiêm túc. Vui lòng kèm theo chuyển khoản (đùa
            thôi). Nếu thấy thiếu thông tin, hãy hỏi — chúng tôi trả lời.
          </p>
        </div>
      </div>
    </section>
  );
}
