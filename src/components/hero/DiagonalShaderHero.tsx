
import React, { useState, useEffect, Suspense } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// Lazy load the 3D canvas to improve FCP
const ShaderCanvas = React.lazy(() => import('./ShaderCanvas'));

interface DiagonalShaderHeroProps {
  children: React.ReactNode;
  colorStart?: string;
  colorEnd?: string;
  angle?: number;
  speed?: number;
  className?: string;
}

export const DiagonalShaderHero: React.FC<DiagonalShaderHeroProps> = ({
  children,
  colorStart = "#635BFF",
  colorEnd = "#4F46E5",
  angle = 45,
  speed = 0.15,
  className
}) => {
  const [shouldUseShader, setShouldUseShader] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const [showReducedMotionToggle, setShowReducedMotionToggle] = useState(false);

  // Stripe-inspired gradient fallback
  const fallbackGradient = {
    background: `linear-gradient(135deg, ${colorStart} 0%, ${colorEnd} 100%)`
  };

  useEffect(() => {
    setShowReducedMotionToggle(true);

    if (!prefersReducedMotion) {
      const timer = setTimeout(() => {
        setShouldUseShader(true);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [prefersReducedMotion]);

  const toggleReducedMotion = () => {
    setShouldUseShader(!shouldUseShader);
  };

  return (
    <div className={cn("relative min-h-screen overflow-hidden", className)}>
      {/* Static gradient fallback - Stripe colors */}
      <div 
        className="absolute inset-0 z-0"
        style={fallbackGradient}
        aria-hidden="true"
      />

      {/* 3D Shader Canvas */}
      {shouldUseShader && !prefersReducedMotion && (
        <Suspense fallback={null}>
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <ShaderCanvas
              colorStart={colorStart}
              colorEnd={colorEnd}
              speed={speed}
              angle={angle}
            />
          </div>
        </Suspense>
      )}

      {/* Reduced motion toggle */}
      {showReducedMotionToggle && (
        <button
          onClick={toggleReducedMotion}
          className="absolute top-6 left-6 z-50 px-3 py-2 text-xs bg-white/10 backdrop-blur-sm rounded-lg text-white/80 hover:bg-white/20 transition-colors font-medium"
          aria-label={`${prefersReducedMotion || !shouldUseShader ? 'Enable' : 'Disable'} motion effects`}
        >
          {prefersReducedMotion || !shouldUseShader ? '🎬 Enable Motion' : '⏸️ Reduce Motion'}
        </button>
      )}

      {/* Hero content overlay */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
};
