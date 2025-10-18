import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
        }}
      >
        {/* CV Document */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            width: '20px',
            height: '24px',
            borderRadius: '2px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            padding: '2px',
          }}
        >
          {/* Document lines */}
          <div
            style={{
              background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
              width: '12px',
              height: '2px',
              borderRadius: '1px',
              margin: '1px 0',
            }}
          />
          <div
            style={{
              background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
              width: '16px',
              height: '1px',
              borderRadius: '0.5px',
              margin: '1px 0',
              opacity: 0.7,
            }}
          />
          <div
            style={{
              background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
              width: '10px',
              height: '1px',
              borderRadius: '0.5px',
              margin: '1px 0',
              opacity: 0.7,
            }}
          />
          
          {/* Letter element */}
          <div
            style={{
              border: '1px solid #3b82f6',
              background: 'rgba(59, 130, 246, 0.1)',
              width: '14px',
              height: '8px',
              borderRadius: '1px',
              marginTop: '2px',
              position: 'relative',
            }}
          />
        </div>
        
        {/* AI Star */}
        <div
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            width: '8px',
            height: '8px',
            borderRadius: '4px',
            position: 'absolute',
            top: '6px',
            right: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '6px',
          }}
        >
          ✦
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}