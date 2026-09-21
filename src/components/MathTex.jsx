import React, { useEffect, useRef } from 'react';
import katex from 'katex';

/**
 * Clean KaTeX formula by stripping accidental surrounding delimiters
 */
function cleanLatexString(raw) {
  if (!raw || typeof raw !== 'string') return '';
  let str = raw.trim();
  if (str.startsWith('$$') && str.endsWith('$$') && str.length >= 4) {
    str = str.slice(2, -2).trim();
  } else if (str.startsWith('$') && str.endsWith('$') && str.length >= 2) {
    str = str.slice(1, -1).trim();
  }
  return str;
}

/**
 * Pure KaTeX Renderer Component
 */
export function MathTex({ math, block = false, className = '' }) {
  const containerRef = useRef(null);
  const cleanedMath = cleanLatexString(math);

  useEffect(() => {
    if (containerRef.current && cleanedMath) {
      try {
        katex.render(cleanedMath, containerRef.current, {
          displayMode: block,
          throwOnError: false,
          strict: false,
          trust: true,
        });
      } catch (err) {
        console.error('KaTeX rendering error:', err);
        containerRef.current.innerText = cleanedMath;
      }
    }
  }, [cleanedMath, block]);

  if (block) {
    return (
      <div
        ref={containerRef}
        className={`overflow-x-auto my-2 py-1 text-center text-zinc-100 font-serif ${className}`}
      />
    );
  }

  return (
    <span
      ref={containerRef}
      className={`inline-block px-0.5 text-zinc-100 font-serif align-middle ${className}`}
    />
  );
}

/**
 * Parses a string containing mixed text, $inline math$, and $$display math$$
 * and renders formatted React elements.
 */
export function MathText({ text, className = '', inlineClass = '' }) {
  if (text === null || text === undefined) return null;
  if (typeof text !== 'string') {
    return <span className={className}>{String(text)}</span>;
  }

  // If the whole string is a raw LaTeX command without $ delimiters (e.g. \frac{a}{b} or \lim_{...})
  const trimmed = text.trim();
  if (
    trimmed.startsWith('\\') &&
    !trimmed.includes(' ') &&
    (trimmed.includes('{') || trimmed.includes('_') || trimmed.includes('^'))
  ) {
    return <MathTex math={trimmed} className={inlineClass} />;
  }

  // Split by $$...$$ display math blocks first
  const displayParts = text.split(/(\$\$[\s\S]+?\$\$)/g);

  return (
    <span className={className}>
      {displayParts.map((displayPart, dIdx) => {
        if (!displayPart) return null;

        // Display math block: $$...$$
        if (displayPart.startsWith('$$') && displayPart.endsWith('$$') && displayPart.length >= 4) {
          const formula = displayPart.slice(2, -2).trim();
          return <MathTex key={`display-${dIdx}`} math={formula} block />;
        }

        // Within text segment, split by $...$ inline math
        const inlineParts = displayPart.split(/(\$[^\$]+?\$)/g);

        return (
          <React.Fragment key={`text-seg-${dIdx}`}>
            {inlineParts.map((part, iIdx) => {
              if (!part) return null;

              // Inline math: $...$
              if (part.startsWith('$') && part.endsWith('$') && part.length >= 2) {
                const formula = part.slice(1, -1).trim();
                return (
                  <MathTex
                    key={`inline-${dIdx}-${iIdx}`}
                    math={formula}
                    block={false}
                    className={inlineClass}
                  />
                );
              }

              // Normal text: handle newlines correctly
              const lines = part.split('\n');
              return (
                <React.Fragment key={`inline-${dIdx}-${iIdx}`}>
                  {lines.map((line, lIdx) => (
                    <React.Fragment key={`line-${lIdx}`}>
                      {lIdx > 0 && <br />}
                      {line}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              );
            })}
          </React.Fragment>
        );
      })}
    </span>
  );
}

export default MathTex;
