const FLOATING_PARTICLES = Array.from({ length: 18 }, (_, index) => index + 1);

export function ArenaAmbientBackground() {
  return (
    <div className="arena-ambient-background" aria-hidden="true">
      <div className="arena-ambient-orb arena-ambient-orb-book" />
      <div className="arena-ambient-orb arena-ambient-orb-star" />

      {FLOATING_PARTICLES.map((particle) => (
        <span
          key={particle}
          className={`arena-ambient-particle arena-ambient-particle-${particle}`}
        />
      ))}
    </div>
  );
}
