import { DotLottie } from '@lottiefiles/dotlottie-web';
import { useRef, useEffect, useCallback } from 'preact/hooks';

interface LottieProps {
  animationData: object;
  className?: string;
  width?: number;
  height?: number;
  loop?: boolean;
}

export default function LottieComponent ({ animationData, className, width, height, loop }: LottieProps) {
  const lottieCanvas = useRef<HTMLCanvasElement | null>(null);
  const lottieAnimation = useRef<DotLottie | null>(null);
  
  useEffect(() => {
    if (lottieAnimation.current) return;

    renderLottieScript();
    assignLottieCanvas();

    lottieAnimation.current = new DotLottie({
      autoplay: true,
      loop,
      canvas: lottieCanvas.current as HTMLCanvasElement,
      data: JSON.stringify(animationData),
      renderConfig: {
        autoResize: false
      }
    });
  }, [ animationData ]);

  const renderLottieScript = useCallback(() => {
    const scriptElementExists = document.querySelector('script#lottie-js');
    if (scriptElementExists) return;

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@lottielab/lottie-player@latest/dist/lottie-player.js';
    script.id = 'lottie-js';

    document.body.appendChild(script);
  }, []);

  const assignLottieCanvas = useCallback(() => {
    if (!lottieCanvas.current) return;

    const dateNow = Date.now();
    const canvasId = `dotlottie-canvas-${dateNow}`;
    lottieCanvas.current.id = canvasId;
  }, []);

  return (
    <div className={className}>
      <canvas 
        ref={lottieCanvas} 
        id='dotlottie-canvas' 
        width={width ?? 90} 
        height={height ?? 90}
      />
    </div>
  );
}
