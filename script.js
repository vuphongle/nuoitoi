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

  // Counter animation
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

  // Petal rain + fireworks
  const petalLayer = document.querySelector(".petal-layer");
  const fireworksLayer = document.querySelector(".fireworks-layer");

  const createPetals = (count = 26) => {
    if (!petalLayer) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i += 1) {
      const petal = document.createElement("span");
      petal.className = "petal";
      const duration = 10 + Math.random() * 8;
      const delay = Math.random() * -duration;
      const size = 12 + Math.random() * 10;
      petal.style.left = `${Math.random() * 100}vw`;
      petal.style.animationDuration = `${duration}s`;
      petal.style.animationDelay = `${delay}s`;
      petal.style.width = `${size}px`;
      petal.style.height = `${size * 0.65}px`;
      frag.appendChild(petal);
    }
    petalLayer.appendChild(frag);
  };

  const spawnFirework = () => {
    if (!fireworksLayer) return;
    const burst = document.createElement("div");
    burst.className = "firework-burst";
    burst.style.left = `${10 + Math.random() * 80}%`;
    burst.style.top = `${12 + Math.random() * 40}vh`;

    const sparkCount = 10;
    const colors = ["", "gold", "red"];
    for (let i = 0; i < sparkCount; i += 1) {
      const spark = document.createElement("span");
      spark.className = `spark ${colors[Math.floor(Math.random() * colors.length)]}`;
      const angle = (Math.PI * 2 * i) / sparkCount + Math.random() * 0.4;
      const distance = 40 + Math.random() * 60;
      spark.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
      spark.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
      burst.appendChild(spark);
    }

    fireworksLayer.appendChild(burst);
    setTimeout(() => burst.remove(), 950);
  };

  if (!prefersReducedMotion) {
    createPetals();
    setInterval(() => spawnFirework(), 1400 + Math.random() * 900);
  }

  // Expense modal
  const modal = document.getElementById("expense-modal");
  const modalBody = document.getElementById("modal-body");
  const modalTitle = document.getElementById("modal-title");

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

  // Image modal for avatars
  const imageModal = document.getElementById("image-modal");
  const imageView = document.getElementById("image-view");
  const imageTitle = document.getElementById("image-title");
  const imageCaption = document.getElementById("image-caption");

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
      id: "lx01",
      name: "Linh Đào",
      tagline: "Ca sáng: canh nồi bánh chưng online",
      bank: "Vietcombank",
      account: "0123456789",
      owner: "Linh Đào",
      content: "Lì xì Linh Đào - [Tên của bạn]",
      qr: "assets/qr/qr01.png",
      avatar: "assets/user/user01.jpeg",
    },
    {
      id: "lx02",
      name: "Phong Lá",
      tagline: "Chuyên viên gói lá dong full option",
      bank: "Techcombank",
      account: "2233445566",
      owner: "Phong Lá",
      content: "Lì xì Phong Lá - [Tên của bạn]",
      qr: "assets/qr/qr02.jpg",
      avatar: "assets/user/user02.jpg",
    },
    {
      id: "lx03",
      name: "Hương Nếp",
      tagline: "Trực mứt gừng, thích số tròn",
      bank: "ACB",
      account: "9988776655",
      owner: "Hương Nếp",
      content: "Lì xì Hương Nếp - [Tên của bạn]",
      qr: "assets/qr/qr03.jpg",
      avatar: "assets/user/user03.jpeg",
    },
    {
      id: "lx04",
      name: "Minh Hiếu",
      tagline: "Ca tối: lau nhà, lau luôn sao kê",
      bank: "MB Bank",
      account: "888999000",
      owner: "Minh Hiếu",
      content: "Lì xì Minh Hiếu - [Tên của bạn]",
      qr: "assets/qr/qr04.jpg",
      avatar: "assets/user/user04.jpeg",
    },
    {
      id: "lx05",
      name: "Hải Yến",
      tagline: "Check bill trước khi mở bao",
      bank: "VPBank",
      account: "5566778899",
      owner: "Hải Yến",
      content: "Lì xì Hải Yến - [Tên của bạn]",
      qr: "assets/qr/qr05.jpg",
      avatar: "assets/user/user05.jpg",
    },
    {
      id: "lx06",
      name: "Anh Phú",
      tagline: "Lì xì đổi lại lời chúc thơm",
      bank: "Sacombank",
      account: "3344556677",
      owner: "Anh Phú",
      content: "Lì xì Anh Phú - [Tên của bạn]",
      qr: "assets/qr/qr06.jpg",
      avatar: "assets/user/user06.jpg",
    },
    {
      id: "lx07",
      name: "Tứn Mai",
      tagline: "Tư vấn phong thủy số tài khoản",
      bank: "BIDV",
      account: "6677889900",
      owner: "Tứn Mai",
      content: "Lì xì Tứn Mai - [Tên của bạn]",
      qr: "assets/qr/qr07.jpg",
      avatar: "assets/user/user07.jpeg",
    },
    {
      id: "lx08",
      name: "Hiếu Bến Tàu",
      tagline: "Ca đêm: đếm tiền lì xì thay bạn",
      bank: "TPBank",
      account: "111222333",
      owner: "Hiếu Bến Tàu",
      content: "Lì xì Hiếu Bến Tàu - [Tên của bạn]",
      qr: "assets/qr/qr02.jpg",
      avatar: "assets/user/user04.jpg",
    },
    {
      id: "lx09",
      name: "Đôn Chủng",
      tagline: "Chủ nhiệm câu lạc bộ hành phi",
      bank: "VietinBank",
      account: "909090123",
      owner: "Đôn Chủng",
      content: "Lì xì Đôn Chủng - [Tên của bạn]",
      qr: "assets/qr/qr03.jpg",
      avatar: "assets/user/user05 (2).jpg",
    },
    {
      id: "lx10",
      name: "Mai Cây Đào",
      tagline: "Livestream gieo quẻ lì xì",
      bank: "Agribank",
      account: "777888999",
      owner: "Mai Cây Đào",
      content: "Lì xì Mai Cây Đào - [Tên của bạn]",
      qr: "assets/qr/qr01.png",
      avatar: "assets/user/user02.jpg",
    },
  ];

  const sessionTrack = document.getElementById("session-track");
  const sessionDots = document.getElementById("session-dots");
  const prevBtn = document.querySelector("[data-session-prev]");
  const nextBtn = document.querySelector("[data-session-next]");
  const contentInput = document.getElementById("transfer-content");
  const copyBtn = document.querySelector("[data-copy]");

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
      if (contentInput) {
        contentInput.value = sessionData[sessionIndex].content;
      }
    };

    const startAuto = () => {
      if (prefersReducedMotion) return;
      sessionTimer = setInterval(() => {
        setSession(sessionIndex + 1);
      }, 6200);
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

  if (copyBtn && contentInput) {
    copyBtn.addEventListener("click", () => {
      const text = contentInput.value || "";
      if (!text) return;
      const original = copyBtn.textContent || "Sao chép";
      const showDone = () => {
        copyBtn.textContent = "Đã copy";
        setTimeout(() => {
          copyBtn.textContent = original;
        }, 1200);
      };

      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(showDone).catch(() => {
          contentInput.select();
          document.execCommand("copy");
          showDone();
        });
      } else {
        contentInput.select();
        document.execCommand("copy");
        showDone();
      }
    });
  }
});
