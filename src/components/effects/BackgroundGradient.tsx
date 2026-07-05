"use client";

/**
 * 背景動態漸變組件。
 * Background dynamic gradient component.
 * 
 * 提供顯著的動態漸變效果，並在沒有自定義背景時顯示幾何圖案。
 */
export function BackgroundGradient({ 
  enabled = true,
  hasBackground = false
}: { 
  enabled?: boolean;
  hasBackground?: boolean;
}) {
  if (!enabled) return null;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* 顯著的流動漸變底層 (主題色背景層) - z-index: 0 */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 animate-gradient-flow opacity-80" />
      
      {/* 幾何圖案背景 - 僅在沒有自定義背景圖片時顯示 */}
      {!hasBackground && (
        <div className="absolute inset-0 opacity-[0.25] transition-opacity duration-700"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1600 800'%3E%3Cg fill='%23d99aa5' fill-opacity='0.4'%3E%3Cpath d='M486 705.8c-109.3-21.8-223.4-32.2-335.3-19.4C99.5 692.1 49 703 0 719.8V800h1600V0h-226.5c-48.8 35.7-91 76.8-126.9 122.1-35.8 45.3-64.1 95.9-84.7 151.8-20.5 55.9-34.4 115.2-41.4 176.1-7 60.9-6.8 122.8 0.5 184.1 7.3 61.3 22 121.4 43.7 178.9 21.7 57.5 51.5 111.4 88.6 159.1l0 0z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}
      
      {/* 裝飾性光暈 (Blob) - 位於主題色層稍微上方 - z-index: 1 */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-primary/10 blur-[160px] animate-float-blob z-[1]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-secondary/10 blur-[160px] animate-float-blob z-[1]" style={{ animationDelay: "-10s" }} />
      
      {/* 噪點紋理層 (增強質感) */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
      />
    </div>
  );
}


