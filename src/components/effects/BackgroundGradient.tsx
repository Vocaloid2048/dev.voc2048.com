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
        <div className="absolute inset-0 opacity-[0.15] mix-blend-multiply dark:mix-blend-overlay transition-opacity duration-700"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1600 800'%3E%3Cg %3E%3Cpath fill='%23d99aa5' d='M486 705.8c-109.3-21.8-223.4-32.2-335.3-19.4C99.5 692.1 49 703 0 719.8V800h1600V0h-226.5c-48.8 35.7-91 76.8-126.9 122.1-35.8 45.3-64.1 95.9-84.7 151.8-20.5 55.9-34.4 115.2-41.4 176.1-7 60.9-6.8 122.8 0.5 184.1 7.3 61.3 22 121.4 43.7 178.9 21.7 57.5 51.5 111.4 88.6 159.1l0 0z'/%3E%3Cpath fill='%23e2b3bc' d='M1157.7 444.1c30.9-5.4 61.8-8.1 92.7-8.1 30.9 0 61.8 2.7 92.7 8.1 24.3 4.3 48.2 9.8 71.6 16.4V0h-331c-19.1 27.6-35.1 57-47.9 88-12.7 31-22.3 63.3-28.7 96.6-6.4 33.3-9.6 67.4-9.6 102 0 34.6 3.2 68.7 9.6 102 6.4 33.3 16 65.6 28.7 96.6 12.7 31 28.8 60.4 47.9 88l0 0z'/%3E%3Cpath fill='%23ebccd2' d='M1000 800v-22.9c-45.6-11.8-91.2-19.3-136.8-22.6-45.6-3.3-91.2-2.1-136.8 3.5-43.4 5.3-86.2 14.1-128.1 26.3L1000 800z'/%3E%3Cpath fill='%23f4e6e9' d='M1600 120.5c-53.3 38.3-104.5 81.3-153.2 128.8-48.7 47.5-94 99.3-135.8 155.3-41.8 56-80.1 115.6-114.8 178.7-34.7 63.1-66 129.5-93.9 199.3L1600 800V120.5z'/%3E%3Cpath fill='%23ffffff' d='M0 380c56.9 0 113.8-3.4 170.7-10.3 56.9-6.9 113.8-17.3 170.7-31.1 54.3-13.1 107.7-28.9 159.9-47.3L0 0V380z'/%3E%3C/g%3E%3C/svg%3E")`,
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


