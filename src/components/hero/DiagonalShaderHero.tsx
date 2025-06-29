import React, { useState, useEffect, Suspense, memo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// Lazy load the 3D canvas to improve FCP with preload hint
const ShaderCanvas = React.lazy(() => {
  // Preload hint for better UX
  const link = document.createElement('link');
  link.rel = 'modulepreload';
  link.href = './ShaderCanvas';
  document.head.appendChild(link);
  
  return import('./ShaderCanvas');
});

// Error boundary for shader canvas
class ShaderErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('Shader canvas failed to load:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}

interface DiagonalShaderHeroProps {
  children: React.ReactNode;
  colorStart?: string;
  colorEnd?: string;
  angle?: number;
  speed?: number;
  className?: string;
}

export const DiagonalShaderHero: React.FC<DiagonalShaderHeroProps> = memo(({
  children,
  colorStart = "#ffffff",
  colorEnd = "#f8fafc",
  angle = 45,
  speed = 0.15,
  className
}) => {
  const [shouldUseShader, setShouldUseShader] = useState(false);
  const [isShaderLoaded, setIsShaderLoaded] = useState(false);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const prefersReducedMotion = useReducedMotion();
  const [showReducedMotionToggle, setShowReducedMotionToggle] = useState(false);

  // Memoized CSS gradient fallback style for performance
  const fallbackGradient = React.useMemo(() => ({
    background: `linear-gradient(135deg, ${colorStart} 0%, ${colorEnd} 100%)`,
    backgroundImage: `
      linear-gradient(135deg, ${colorStart} 0%, ${colorEnd} 100%),
      radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
      radial-gradient(circle at 70% 80%, rgba(0,0,0,0.1) 0%, transparent 50%)
    `
  }), [colorStart, colorEnd]);

  // WebGL capability detection
  const checkWebGLSupport = useCallback(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    // Check WebGL support
    const hasWebGL = checkWebGLSupport();
    setWebGLSupported(hasWebGL);
    setShowReducedMotionToggle(true);
    if (!prefersReducedMotion && hasWebGL) {
      const loadShader = () => {
        const timer = setTimeout(() => {
          setShouldUseShader(true);
        }, 150);
        return timer;
      };
      if ('requestIdleCallback' in window) {
        const idleCallback = (window as any).requestIdleCallback(loadShader, { timeout: 1000 });
        return () => {
          (window as any).cancelIdleCallback(idleCallback);
        };
      } else {
        const timer = loadShader();
        return () => clearTimeout(timer);
      }
    }
  }, [prefersReducedMotion, checkWebGLSupport]);

  const toggleReducedMotion = useCallback(() => {
    setShouldUseShader(!shouldUseShader);
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'motion_preference_toggle', {
        'custom_parameter': shouldUseShader ? 'disabled' : 'enabled'
      });
    }
  }, [shouldUseShader]);

  const handleShaderLoad = useCallback(() => {
    setIsShaderLoaded(true);
  }, []);

  return (
    <header 
      className={cn("relative min-h-screen overflow-hidden", className)}
      aria-label="Hero section with interactive background"
    >
      {/* Static CSS gradient fallback - always rendered for SSR/FCP */}
      <div 
        className={cn(
          "absolute inset-0 z-0 transition-opacity duration-500",
          shouldUseShader && isShaderLoaded && webGLSupported ? "opacity-0" : "opacity-100"
        )}
        style={fallbackGradient}
        aria-hidden="true"
      />

      {/* 3D Shader Canvas - lazy loaded with comprehensive error handling */}
      {shouldUseShader && !prefersReducedMotion && webGLSupported && (
        <ShaderErrorBoundary 
          fallback={
            <div 
              className="absolute inset-0 z-0" 
              style={fallbackGradient}
              aria-hidden="true"
            />
          }
        >
          <Suspense 
            fallback={
              <div className="absolute inset-0 z-0 flex items-center justify-center">
                <div 
                  className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"
                  aria-label="Loading 3D background"
                />
              </div>
            }
          >
            <div 
              className={cn(
                "absolute inset-0 z-0 transition-opacity duration-500",
                isShaderLoaded ? "opacity-100" : "opacity-0"
              )} 
              aria-hidden="true"
            >
              <ShaderCanvas
                colorStart={colorStart}
                colorEnd={colorEnd}
                speed={speed}
                angle={angle}
                onLoad={handleShaderLoad}
              />
            </div>
          </Suspense>
        </ShaderErrorBoundary>
      )}

      {/* Performance and accessibility controls */}
      <div className="absolute top-4 left-4 z-50 flex flex-col gap-2">
        {/* Reduced motion toggle */}
        {showReducedMotionToggle && (
          <button
            onClick={toggleReducedMotion}
            className="px-3 py-1.5 text-xs bg-white/20 backdrop-blur-sm rounded-md text-white hover:bg-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label={`${prefersReducedMotion || !shouldUseShader ? 'Enable' : 'Disable'} motion effects`}
            type="button"
          >
            {prefersReducedMotion || !shouldUseShader ? '🎬 Enable Motion' : '⏸️ Reduce Motion'}
          </button>
        )}
        
        {/* WebGL support indicator */}
        {!webGLSupported && (
          <output 
            className="px-3 py-1.5 text-xs bg-yellow-500/20 backdrop-blur-sm rounded-md text-yellow-100 border border-yellow-400/30"
            aria-live="polite"
          >
            ⚠️ Enhanced graphics unavailable
          </output>
        )}
        
        {/* Performance indicator */}
        {shouldUseShader && webGLSupported && (
          <output 
            className={cn(
              "px-3 py-1.5 text-xs backdrop-blur-sm rounded-md transition-all duration-200",
              isShaderLoaded 
                ? "bg-green-500/20 text-green-100 border border-green-400/30" 
                : "bg-blue-500/20 text-blue-100 border border-blue-400/30"
            )}
            aria-live="polite"
          >
            {isShaderLoaded ? '✓ Enhanced graphics active' : '⏳ Loading enhanced graphics'}
          </output>
        )}
      </div>

      {/* Hero content overlay with improved semantics */}
      <main className="relative z-10 min-h-screen flex flex-col">
        {children}
      </main>
    </header>
  );
});

// Display name for debugging
DiagonalShaderHero.displayName = 'DiagonalShaderHero';
