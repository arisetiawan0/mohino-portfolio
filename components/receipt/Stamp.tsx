/** Stempel tinta merah. Satu-satunya tempat warna --stempel dipakai. */
export function Stamp({
  children,
  className = "",
  animate = true,
  rotate = -8,
  size = "1.15rem",
  onDark = false,
}: {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  rotate?: number;
  size?: string;
  /** Di atas latar gelap: tinta tidak di-multiply supaya merahnya tetap terbaca. */
  onDark?: boolean;
}) {
  return (
    <span
      className={`stamp ${onDark ? "stamp-dark" : ""} ${animate ? "stamp-in" : ""} ${className}`}
      style={{ "--rot": `${rotate}deg`, fontSize: size } as React.CSSProperties}
    >
      {children}
    </span>
  );
}
