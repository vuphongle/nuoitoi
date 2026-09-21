import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <div className="surface-card max-w-md p-8 text-center">
        <span className="text-4xl" aria-hidden>
          ⌕
        </span>
        <h1 className="mt-4 text-2xl font-black text-slate-950">Không tìm thấy trang này</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Có thể đường dẫn đã thay đổi hoặc hồ sơ không còn hoạt động.
        </p>
        <Link className="button button-primary mt-6" href="/">
          Về trang chủ
        </Link>
      </div>
    </main>
  );
}
