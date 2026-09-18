'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { sessionData, type LixiSession } from './data';

export function DonateCarousel() {
  const shouldReduceMotion = useReducedMotion();
  const [autoplay] = useState(() => Autoplay({ delay: 6200 }));
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeImage, setActiveImage] = useState<LixiSession | null>(null);
  const [copied, setCopied] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    // Sync initial slide index from the embla instance, then subscribe for changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (shouldReduceMotion) {
      autoplay.stop();
    }
  }, [shouldReduceMotion, autoplay]);

  const current = sessionData[selectedIndex] ?? sessionData[0];

  const handleCopy = async () => {
    const text = current.content;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <section id="donate" className="relative py-20 scroll-mt-27.5">
      <div
        className="absolute inset-0 left-1/2 -z-[1] w-[min(1180px,94vw)] -translate-x-1/2 rounded-[32px] shadow-[0_30px_80px_rgba(215,38,61,0.35)]"
        style={{
          background: 'linear-gradient(135deg, rgba(215,38,61,0.95), rgba(242,140,40,0.9))',
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto w-[min(1180px,94vw)]">
        <div className="mb-6 text-center">
          <p className="text-sm font-extrabold uppercase tracking-wide">Lì xì chuyển khoản</p>
          <h2 className="my-1.5 text-3xl font-bold sm:text-4xl">
            Lì xì ngay đi, nếu bạn đang cười!
          </h2>
          <p className="my-1.5">
            Chọn trạm phát lì xì / ca trực của người nhận, quét đúng QR tương ứng.
          </p>
        </div>

        <div className="rounded-3xl border border-white/35 bg-white/10 p-4.5 shadow-[0_18px_50px_rgba(0,0,0,0.14)]">
          <div className="mb-3.5 text-center">
            <h3 className="mb-1.5 text-xl font-bold">10 phiên - mỗi người một QR riêng</h3>
            <p className="m-0">
              Đổi phiên để quét đúng người. Nội dung chuyển khoản sẽ tự đổi theo.
            </p>
          </div>

          <div
            className="overflow-hidden rounded-[18px] border border-white/32 bg-white/12"
            ref={emblaRef}
          >
            <div className="flex">
              {sessionData.map((session, index) => (
                <div key={session.id} className="min-w-full shrink-0 p-3" role="listitem">
                  <div className="grid items-center gap-4.5 rounded-[18px] bg-white p-4.5 text-[#1f1a17] shadow-[0_16px_40px_rgba(0,0,0,0.14)] [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
                    <div className="flex flex-col items-start gap-3">
                      <div className="flex items-start justify-start gap-2.5">
                        <button
                          type="button"
                          onClick={() => setActiveImage(session)}
                          className="h-22.5 w-22.5 shrink-0 cursor-zoom-in overflow-hidden rounded-[18px] border-[3px] border-[#d7263d] bg-[#fff7f3] shadow-[0_10px_20px_rgba(0,0,0,0.12)] min-[641px]:h-27 min-[641px]:w-27"
                          aria-label={`Xem ảnh của ${session.name}`}
                        >
                          <Image
                            src={session.avatar}
                            alt={`Ảnh của ${session.name}`}
                            width={108}
                            height={108}
                            className="h-full w-full object-cover"
                            preload={index === 0}
                          />
                        </button>
                        <div className="flex flex-col items-start gap-0.5">
                          <h4 className="mb-1.5 text-lg font-bold">@{session.name}</h4>
                          <p className="mb-2.5 text-[#6a5c55]">{session.tagline}</p>
                        </div>
                      </div>
                      <div>
                        <div className="grid gap-2">
                          <div className="grid grid-cols-1 gap-2.5 rounded-[10px] border border-dashed border-black/8 bg-black/2 p-2.5 min-[901px]:grid-cols-[150px_1fr]">
                            <span className="font-bold text-[#6a5c55]">Ngân hàng</span>
                            <span className="font-extrabold min-[901px]:text-right">
                              {session.bank}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 gap-2.5 rounded-[10px] border border-dashed border-black/8 bg-black/2 p-2.5 min-[901px]:grid-cols-[150px_1fr]">
                            <span className="font-bold text-[#6a5c55]">Số tài khoản</span>
                            <span className="font-extrabold min-[901px]:text-right">
                              {session.account}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 gap-2.5 rounded-[10px] border border-dashed border-black/8 bg-black/2 p-2.5 min-[901px]:grid-cols-[150px_1fr]">
                            <span className="font-bold text-[#6a5c55]">Chủ tài khoản</span>
                            <span className="font-extrabold min-[901px]:text-right">
                              {session.owner}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 gap-2.5 rounded-[10px] border border-dashed border-black/8 bg-black/2 p-2.5 min-[901px]:grid-cols-[150px_1fr]">
                            <span className="font-bold text-[#6a5c55]">Nội dung</span>
                            <span className="font-extrabold wrap-break-word min-[901px]:text-right">
                              {session.content}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="mb-2 font-bold text-[#6a5c55]">QR riêng cho phiên này</p>
                      <div className="mx-auto mb-2.5 grid h-50 w-50 max-w-[80vw] place-items-center overflow-hidden rounded-2xl border-2 border-dashed border-black/10 bg-white shadow-[0_12px_28px_rgba(0,0,0,0.12)] min-[641px]:h-60 min-[641px]:w-60">
                        <Image
                          src={session.qr}
                          alt={`QR của ${session.name}`}
                          width={240}
                          height={240}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <p className="m-0 font-semibold text-[#6a5c55]">
                        Quét bằng app ngân hàng hoặc ví điện tử
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              aria-label="Phiên trước"
              className="rounded-[14px] border border-black/6 bg-black/4 px-3.5 py-2.5 font-extrabold cursor-pointer"
            >
              ← Trước
            </button>
            <div className="inline-flex gap-2" aria-label="Chọn phiên">
              {sessionData.map((session, index) => (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => emblaApi?.scrollTo(index)}
                  aria-label={`Chọn phiên ${index + 1}`}
                  className={cn(
                    'h-3 w-3 rounded-full border border-white/60 bg-white/40 transition',
                    index === selectedIndex &&
                      '-translate-y-px bg-white shadow-[0_10px_18px_rgba(0,0,0,0.18)]'
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              aria-label="Phiên tiếp theo"
              className="rounded-[14px] border border-black/6 bg-black/4 px-3.5 py-2.5 font-extrabold cursor-pointer"
            >
              Sau →
            </button>
          </div>

          <div className="mt-4 rounded-2xl border border-white/30 bg-white/12 p-3.5">
            <label htmlFor="transfer-content" className="mb-2 block font-bold">
              Nội dung chuyển khoản gợi ý
            </label>
            <div className="grid grid-cols-[1fr_auto] items-center gap-2.5 max-[640px]:grid-cols-1">
              <input
                id="transfer-content"
                type="text"
                readOnly
                value={current.content}
                aria-live="polite"
                className="w-full rounded-xl bg-white/90 px-3 py-2.5 font-bold text-[#1f1a17]"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-[14px] border border-black/6 bg-black/4 px-3 py-2.5 text-sm font-extrabold text-[#1f1a17]"
              >
                {copied ? 'Đã copy' : 'Sao chép'}
              </button>
            </div>
            <p className="mt-2.5 mb-0 font-semibold">
              Chuyển xong là có lời cảm ơn auto (minh họa).
            </p>
          </div>
        </div>
      </div>

      <Dialog open={!!activeImage} onOpenChange={(open) => !open && setActiveImage(null)}>
        <DialogContent className="max-w-160 text-center">
          {activeImage && (
            <>
              <DialogTitle>Xem ảnh người nhận</DialogTitle>
              <div className="relative mx-auto max-h-[70vh] w-full overflow-hidden rounded-[14px] bg-white shadow-[0_24px_60px_rgba(215,38,61,0.12)]">
                <Image
                  src={activeImage.avatar}
                  alt={`Ảnh của ${activeImage.name}`}
                  width={640}
                  height={640}
                  className="h-full w-full object-contain"
                />
              </div>
              <p className="mt-2 font-semibold text-[#6a5c55]">
                @{activeImage.name} - {activeImage.tagline}
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
