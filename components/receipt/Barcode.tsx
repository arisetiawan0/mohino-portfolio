import { code128 } from "@/lib/code128";

/** Barcode Code128-B dari teks. Batang SVG boleh melebar, label tetap HTML. */
export function Barcode({
  value,
  className,
  height = 56,
  label = true,
}: {
  value: string;
  className?: string;
  /** Tinggi batang dalam piksel. */
  height?: number;
  label?: boolean;
}) {
  const { bars, width } = code128(value);
  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${width} 10`}
        className="block w-full"
        style={{ height }}
        role="img"
        aria-label={`Barcode ${value}`}
        preserveAspectRatio="none"
        shapeRendering="crispEdges"
      >
        <g fill="currentColor">
          {bars.map((b, i) => (
            <rect key={i} x={b.x} y={0} width={b.w} height={10} />
          ))}
        </g>
      </svg>
      {label ? (
        <span aria-hidden className="mt-1.5 block text-center font-mono text-[0.6875rem] tracking-[0.35em]">
          {value}
        </span>
      ) : null}
    </div>
  );
}
