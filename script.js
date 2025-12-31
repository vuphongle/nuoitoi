document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const formatValue = (value, format, suffix = "") => {
    const rounded = Math.round(value);
    if (format === "currency") {
      return `${rounded.toLocaleString("vi-VN")} đ`;
    }
    return `${rounded.toLocaleString("vi-VN")}${suffix}`;
  };

  const counters = document.querySelectorAll("[data-counter]");
  counters.forEach((counter) => {
    const target = Number(counter.dataset.target || 0);
    const format = counter.dataset.format;
    const suffix = counter.dataset.suffix || "";

    if (prefersReducedMotion) {
      counter.textContent = formatValue(target, format, suffix);
      return;
    }

    const duration = 1600;
    const start = performance.now();

    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const current = target * progress;
      counter.textContent = formatValue(current, format, suffix);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  });

  const modal = document.getElementById("expense-modal");
  const modalBody = document.getElementById("modal-body");
  const modalTitle = document.getElementById("modal-title");
  const imageModal = document.getElementById("image-modal");
  const imageView = document.getElementById("image-view");
  const imageTitle = document.getElementById("image-title");
  const imageCaption = document.getElementById("image-caption");

  if (modal && modalBody && modalTitle) {
    const closeModal = () => {
      modal.classList.remove("show");
      modal.setAttribute("aria-hidden", "true");
    };

    document.querySelectorAll(".open-modal").forEach((btn) => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".expense-card");
        if (!card) return;

        const title =
          card.querySelector(".expense-title")?.textContent?.trim() ||
          "Chi tiết chi tiêu";
        const amount =
          card.querySelector(".expense-amount")?.textContent?.trim() || "";
        const date =
          card.querySelector(".expense-date")?.textContent?.trim() || "";
        const details = card.querySelector(".expense-details")?.innerHTML || "";

        modalTitle.textContent = title;
        modalBody.innerHTML = `<p class="modal-amount">${amount}</p><p class="modal-date">${date}</p>${details}`;
        modal.classList.add("show");
        modal.setAttribute("aria-hidden", "false");
      });
    });

    modal.addEventListener("click", (event) => {
      if (event.target.dataset.close !== undefined || event.target === modal) {
        closeModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("show")) {
        closeModal();
      }
    });
  }

  const attachImageModal = () => {
    if (!(imageModal && imageView && imageTitle && imageCaption)) return;

    const closeImage = () => {
      imageModal.classList.remove("show");
      imageModal.setAttribute("aria-hidden", "true");
    };

    const openImage = (imgEl) => {
      if (!imgEl) return;
      const src = imgEl.getAttribute("src");
      const alt = imgEl.getAttribute("alt") || "Ảnh người nhận";
      const caption = imgEl.dataset.caption || alt;
      if (!src) return;
      imageView.src = src;
      imageView.alt = alt;
      imageCaption.textContent = caption;
      imageModal.classList.add("show");
      imageModal.setAttribute("aria-hidden", "false");
    };

    imageModal.addEventListener("click", (event) => {
      if (
        event.target.dataset.close !== undefined ||
        event.target === imageModal
      ) {
        closeImage();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && imageModal.classList.contains("show")) {
        closeImage();
      }
    });

    document.body.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLImageElement)) return;
      if (target.closest(".session-avatar")) {
        openImage(target);
      }
    });
  };

  const sessionData = [
    {
      id: "user01",
      name: "Le Don Chung",
      tagline: "Ca sáng - ăn mì gói trước khi sao kê",
      bank: "Vietcombank",
      account: "1234567890",
      owner: "LE DON CHUNG",
      content: "Nuoi Le Don Chung [Ten cua ban]",
      qr: "assets/qr/qr01.png",
      avatar: "assets/user/user01.jpeg",
    },
    {
      id: "user02",
      name: "Nguyen Trung Hieu",
      tagline: "Ca trưa - fan trung thành của bún bò",
      bank: "Techcombank",
      account: "222333444",
      owner: "NGUYEN TRUNG HIEU",
      content: "Nuoi Nguyen Trung Hieu [Ten cua ban]",
      qr: "assets/qr/qr02.jpg",
      avatar: "assets/user/user02.jpeg",
    },
    {
      id: "user03",
      name: "Do Nguyen Quynh Huong",
      tagline: "Ca chiều - chuyên viên check mail cảm ơn",
      bank: "ACB",
      account: "555666777",
      owner: "NGO MAI ANH",
      content: "Nuoi Do Nguyen Quynh Huong [Ten cua ban]",
      qr: "assets/qr/qr03.jpg",
      avatar: "assets/user/user03.jpeg",
    },
    {
      id: "user04",
      name: "Le Vu Phong",
      tagline: "Ca tối - livestream bảng tính minh bạch",
      bank: "MB Bank",
      account: "888999000",
      owner: "PHAM TUAN NGHIA",
      content: "Nuoi Le Vu Phong [Ten cua ban]",
      qr: "assets/qr/qr04.png",
      avatar: "assets/user/user04.jpeg",
    },
  ];

  const sessionTrack = document.getElementById("session-track");
  const sessionDots = document.getElementById("session-dots");
  const prevBtn = document.querySelector("[data-session-prev]");
  const nextBtn = document.querySelector("[data-session-next]");

  if (sessionTrack && sessionDots && sessionData.length) {
    if (prefersReducedMotion) {
      sessionTrack.style.transition = "none";
    }

    sessionData.forEach((item, index) => {
      const slide = document.createElement("article");
      slide.className = "session-slide";
      slide.setAttribute("role", "listitem");
      slide.innerHTML = `
        <div class="slide-card">
          <div class="slide-left">
            <div class="session-avatar">
              <img src="${item.avatar}" alt="Ảnh của ${item.name}" loading="lazy" data-caption="@${item.name} - ${item.tagline}" />
            </div>
            <div class="session-meta">
              <h4>@${item.name}</h4>
              <p class="tagline">${item.tagline}</p>
              <div class="info-grid">
                <div class="info-row">
                  <span class="info-label">Ngân hàng</span>
                  <span class="info-value">${item.bank}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Số tài khoản</span>
                  <span class="info-value">${item.account}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Chủ tài khoản</span>
                  <span class="info-value">${item.owner}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Nội dung</span>
                  <span class="info-value">${item.content}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="slide-right">
            <p class="qr-label">QR riêng cho phiên này</p>
            <div class="qr-display">
              <img src="${item.qr}" alt="QR của ${item.name}" loading="lazy" />
            </div>
            <p class="qr-note">Quét bằng app ngân hàng hoặc ví điện tử</p>
          </div>
        </div>
      `;
      sessionTrack.appendChild(slide);

      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Chọn phiên ${index + 1}`);
      dot.dataset.index = String(index);
      sessionDots.appendChild(dot);
    });

    let sessionIndex = 0;
    let sessionTimer;

    const setSession = (nextIndex) => {
      sessionIndex = (nextIndex + sessionData.length) % sessionData.length;
      sessionTrack.style.transform = `translateX(-${sessionIndex * 100}%)`;
      sessionDots.querySelectorAll("button").forEach((dot, idx) => {
        dot.classList.toggle("active", idx === sessionIndex);
      });
    };

    const startAuto = () => {
      if (prefersReducedMotion) return;
      sessionTimer = setInterval(() => {
        setSession(sessionIndex + 1);
      }, 5000);
    };

    const resetAuto = () => {
      if (sessionTimer) clearInterval(sessionTimer);
      startAuto();
    };

    prevBtn?.addEventListener("click", () => {
      setSession(sessionIndex - 1);
      resetAuto();
    });

    nextBtn?.addEventListener("click", () => {
      setSession(sessionIndex + 1);
      resetAuto();
    });

    sessionDots.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLButtonElement)) return;
      const idx = Number(target.dataset.index);
      if (Number.isNaN(idx)) return;
      setSession(idx);
      resetAuto();
    });

    setSession(0);
    startAuto();
    attachImageModal();
  }
});
