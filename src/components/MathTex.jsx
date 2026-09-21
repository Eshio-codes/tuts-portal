import React, { useEffect, useRef } from 'react';
import katex from 'katex';

export default function MathTex({ math, block = false, className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && math) {
      try {
        katex.render(math, containerRef.current, {
          displayMode: block,
          throwOnError: false,
        });
      } catch (err) {
        console.error('KaTeX rendering error:', err);
        containerRef.current.innerText = math;
      }
    }
  }, [math, block]);

  if (block) {
    return <div ref={containerRef} className={`overflow-x-auto my-2 text-center text-zinc-100 ${className}`} />;
  }

  return <span ref={containerRef} className={`inline-block px-0.5 text-zinc-100 font-serif ${className}`} />;
}
