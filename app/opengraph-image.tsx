import { ImageResponse } from 'next/og'

export const alt = 'VANE Science: We gave Human Movement a language.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const BRAND_ON_DARK = '#FFFFFF'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#040507',
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top row: wordmark + overline */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
            }}
          >
            {/* Geometric V mark */}
            <svg width="52" height="52" viewBox="0 0 64 64">
              <polygon
                points="13,16 24.5,16 32,36.5 39.5,16 51,16 38,48 26,48"
                fill={BRAND_ON_DARK}
              />
            </svg>
            <div
              style={{
                display: 'flex',
                fontSize: 44,
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: '#FFFFFF',
              }}
            >
              VANE
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 18,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: BRAND_ON_DARK,
            }}
          >
            Movement quality. Measured.
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 28,
          }}
        >
          <div
            style={{
              display: 'flex',
              width: 64,
              height: 3,
              backgroundColor: BRAND_ON_DARK,
            }}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 84,
              fontWeight: 300,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              color: '#FFFFFF',
            }}
          >
            <div style={{ display: 'flex' }}>We gave Human Movement</div>
            <div style={{ display: 'flex', color: 'rgba(255,255,255,0.72)' }}>
              a language.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.14)',
            paddingTop: 28,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 20,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.62)',
            }}
          >
            vanescience.com
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 18,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.45)',
            }}
          >
            Movement Quality Score
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
