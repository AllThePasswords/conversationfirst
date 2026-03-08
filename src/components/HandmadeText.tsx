interface HandmadeTextProps {
  children: string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * Wraps each character in a span with unique per-character variation.
 * Uses irrational multipliers (golden ratio, √5, √3, √7) so the
 * combination of rotation + translateY + scale + skew + weight
 * never visibly repeats — each character looks hand-drawn.
 */
export default function HandmadeText({ children, className, as: Tag = 'span' }: HandmadeTextProps) {
  return (
    // @ts-expect-error — dynamic tag element
    <Tag className={className}>
      {children.split('').map((ch, i) =>
        ch === ' ' ? (
          <span key={i}>{' '}</span>
        ) : (
          <span
            key={i}
            className="hm-ch"
            style={{
              '--hm-i': i,
              // Vary weight for variable fonts — each character gets a
              // slightly different stroke weight (like pen pressure variation)
              fontWeight: Math.round(400 + Math.sin(i * 1.618) * 28),
            } as React.CSSProperties}
          >
            {ch}
          </span>
        )
      )}
    </Tag>
  );
}
