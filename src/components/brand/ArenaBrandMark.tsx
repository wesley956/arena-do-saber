interface ArenaBrandMarkProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<ArenaBrandMarkProps["size"]>, string> = {
  sm: "h-12 w-12",
  md: "h-16 w-16",
  lg: "h-20 w-20 sm:h-24 sm:w-24",
};

const PARTICLES = [
  "arena-brand-particle-1",
  "arena-brand-particle-2",
  "arena-brand-particle-3",
  "arena-brand-particle-4",
  "arena-brand-particle-5",
  "arena-brand-particle-6",
];

export function ArenaBrandMark({
  size = "md",
  className = "",
}: ArenaBrandMarkProps) {
  return (
    <div
      className={`arena-brand-mark ${SIZE_CLASSES[size]} ${className}`}
      aria-hidden="true"
    >
      <div className="arena-brand-glow" />

      <img
        src="/logo.png"
        alt=""
        className="arena-brand-clean-image"
        draggable={false}
      />

      {PARTICLES.map((particle) => (
        <span key={particle} className={`arena-brand-particle ${particle}`} />
      ))}
    </div>
  );
}
