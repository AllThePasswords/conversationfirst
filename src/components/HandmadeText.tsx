interface HandmadeTextProps {
  children: string;
  className?: string;
}

export default function HandmadeText({ children, className }: HandmadeTextProps) {
  return (
    <span className={className}>
      {children.split('').map((ch, i) =>
        ch === ' ' ? (
          <span key={i}>{' '}</span>
        ) : (
          <span
            key={i}
            className="hm-ch"
            style={{ '--hm-i': i } as React.CSSProperties}
          >
            {ch}
          </span>
        )
      )}
    </span>
  );
}
