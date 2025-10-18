import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

// Image generation
export default function AppleIcon() {
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
          borderRadius: '40px',
        }}
      >
        {/* CV Document */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            width: '100px',
            height: '120px',
            borderRadius: '8px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            padding: '12px',
          }}
        >
          {/* Document Header */}
          <div
            style={{
              background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
              width: '60px',
              height: '8px',
              borderRadius: '4px',
              marginBottom: '8px',
            }}
          />
          
          {/* Document lines */}
          <div
            style={{
              background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
              width: '76px',
              height: '4px',
              borderRadius: '2px',
              marginBottom: '4px',
              opacity: 0.7,
            }}
          />
          <div
            style={{
              background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
              width: '50px',
              height: '4px',
              borderRadius: '2px',
              marginBottom: '12px',
              opacity: 0.7,
            }}
          />
          
          {/* Letter element */}
          <div
            style={{
              border: '2px solid #3b82f6',
              background: 'rgba(59, 130, 246, 0.1)',
              width: '70px',
              height: '40px',
              borderRadius: '4px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Envelope fold */}
            <div
              style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                right: '8px',
                height: '2px',
                background: '#3b82f6',
                clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
              }}
            />
          </div>
        </div>
        
        {/* AI Star */}
        <div
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            width: '24px',
            height: '24px',
            borderRadius: '12px',
            position: 'absolute',
            top: '40px',
            right: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
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