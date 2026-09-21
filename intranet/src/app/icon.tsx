import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        alignItems: 'center',
        background: '#16221f',
        borderRadius: 16,
        color: 'white',
        display: 'flex',
        fontSize: 22,
        fontWeight: 900,
        height: '100%',
        justifyContent: 'center',
        letterSpacing: -1,
        width: '100%',
      }}
    >
      NM
    </div>,
    size
  );
}
