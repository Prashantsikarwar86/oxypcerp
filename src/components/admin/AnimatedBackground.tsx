export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-mesh" />
      <div
        className="absolute inset-0 opacity-[0.04] animate-grid"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/30 blur-3xl animate-float-orb" />
      <div
        className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-accent/25 blur-3xl animate-float-orb"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-primary-glow/25 blur-3xl animate-float-orb"
        style={{ animationDelay: "-12s" }}
      />
    </div>
  );
}
