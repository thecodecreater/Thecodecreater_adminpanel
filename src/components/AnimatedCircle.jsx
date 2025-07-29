import { useEffect, useRef } from 'react';

export default function AnimatedCircle({ size = 120, color = '#06b6d4', duration = 1.2 }) {
  const circleRef = useRef(null);

  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;
    circle.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(0.7)' },
      { transform: 'scale(1)' }
    ], {
      duration: duration * 1000,
      iterations: Infinity,
      easing: 'ease-in-out'
    });
  }, [duration]);

  return (
    <div
      ref={circleRef}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle at 60% 40%, ${color} 70%, #fff0 100%)`,
        boxShadow: `0 0 40px 0 ${color}55`,
        margin: 'auto',
      }}
      className="transition-transform"
    />
  );
}
