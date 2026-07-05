"use client";

/**
 * 櫻花飄落動畫 — Canvas 粒子系統。
 * Cherry blossom falling animation — Canvas particle system.
 *
 * 使用自建 Canvas 實作花瓣形狀與物理動畫，
 * 尊重 prefers-reduced-motion，可由後台 SiteConfig 控制開關。
 */
import { useEffect, useRef, useState } from "react";

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  swayAmplitude: number;
  swayOffset: number;
}

interface CherryBlossomProps {
  count?: number;
  enabled?: boolean;
}

export function CherryBlossom({
  count = 30,
  enabled = true,
}: CherryBlossomProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!enabled || reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let petals: Petal[] = [];
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // 手機減少花瓣數量
      const actualCount = window.innerWidth < 768 ? Math.floor(count / 2) : count;
      petals = Array.from({ length: actualCount }, () => createPetal(canvas.width));
    };

    const createPetal = (maxX: number): Petal => ({
      x: Math.random() * maxX,
      y: -20 - Math.random() * 200,
      size: 14 + Math.random() * 12,
      speedY: 0.5 + Math.random() * 1.0,
      speedX: -0.3 + Math.random() * 0.6,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: -0.02 + Math.random() * 0.04,
      opacity: 0.4 + Math.random() * 0.5,
      swayAmplitude: 0.5 + Math.random() * 1.5,
      swayOffset: Math.random() * Math.PI * 2,
    });

    const drawPetal = (
      ctx: CanvasRenderingContext2D,
      petal: Petal
    ) => {
      ctx.save();
      ctx.translate(petal.x, petal.y);
      ctx.rotate(petal.rotation);
      ctx.globalAlpha = petal.opacity;
      
      // 使用 🌸 表情符號
      ctx.font = `${petal.size}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🌸", 0, 0);

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;

      for (const petal of petals) {
        // 下落
        petal.y += petal.speedY;
        // 左右搖擺 (sin 波)
        petal.x += petal.speedX + Math.sin(time + petal.swayOffset) * petal.swayAmplitude * 0.5;
        // 旋轉
        petal.rotation += petal.rotationSpeed;

        drawPetal(ctx, petal);

        // 重置花瓣 (從頂部重新生成)
        if (petal.y > canvas.height + 20) {
          Object.assign(petal, createPetal(canvas.width));
        }
        // 水平邊界環繞
        if (petal.x < -20) petal.x = canvas.width + 20;
        if (petal.x > canvas.width + 20) petal.x = -20;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [enabled, reducedMotion, count]);

  if (!enabled || reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="cherry-blossom-container"
      aria-hidden="true"
    />
  );
}
