import { DotLottie } from '@lottiefiles/dotlottie-web';
import { useRef, useEffect } from 'preact/hooks';
import { useState } from 'preact/hooks';

interface LottieProps {
  animationData: object;
  className?: string;
  width?: number;
  height?: number;
  loop?: boolean;
  delay?: number;
}

export default function LottieComponent ({ animationData, className, width, height, loop, delay }: LottieProps) {
  const hasStartedMountingRef = useRef(false);
  const lottieAnimationRef = useRef<DotLottie | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const canvasIdRef = useRef((Date.now() + Math.random()).toString());
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ lottiePlayerReady, setLottiePlayerReady ] = useState(false);
  
  useEffect(() => {
    if (hasStartedMountingRef.current) return;
    hasStartedMountingRef.current = true;

    (async () => {
      await import('@lottielab/lottie-player/web');
      window.requestAnimationFrame(() => setLottiePlayerReady(true));
    })();
  }, []);

  useEffect(() => {
    if (!lottiePlayerReady) return;
    if (lottieAnimationRef.current) return;

    lottieAnimationRef.current = new DotLottie({
      autoplay: delay ? false : true,
      loop,
      canvas: canvasRef.current!,
      data: JSON.stringify(animationData),
      renderConfig: {
        autoResize: false
      }
    });

    if (delay) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        lottieAnimationRef.current?.play();
      }, delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      lottieAnimationRef.current?.destroy();
      lottieAnimationRef.current = null;
    };
  }, [ lottiePlayerReady, animationData, delay, loop ]);

  return (
    <div className={className}>
      {lottiePlayerReady ? (
        <canvas 
          ref={canvasRef} 
          id={canvasIdRef.current}
          width={width ?? 96} 
          height={height ?? 96}
        />
      ) : (
        <div />
      )}
    </div>
  );
}
