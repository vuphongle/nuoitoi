import { ImageResponse } from 'next/og';

export const alt = 'TranX - Ứng dụng dịch thuật đa ngôn ngữ';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        color: 'white',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 96,
            height: 96,
            borderRadius: 24,
            background: 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)',
            fontSize: 56,
            fontWeight: 700,
          }}
        >
          T
        </div>
        <div style={{ display: 'flex', fontSize: 84, fontWeight: 700 }}>TranX</div>
      </div>
      <div style={{ display: 'flex', fontSize: 36, color: '#cbd5e1' }}>
        Ứng dụng dịch thuật đa ngôn ngữ
      </div>
    </div>,
    { ...size }
  );
}
