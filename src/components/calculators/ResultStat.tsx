export function ResultStat({
  label,
  value,
  unit,
  emphasis,
}: {
  label: string;
  value: string;
  unit?: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={
        emphasis
          ? "rounded-2xl border border-border-strong bg-gradient-to-br from-brand/8 to-transparent p-5"
          : "rounded-2xl border border-border bg-background p-5"
      }
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </p>
      <p
        className={
          emphasis
            ? "mt-1.5 text-3xl font-extrabold tracking-tight text-brand-dark"
            : "mt-1.5 text-2xl font-extrabold tracking-tight text-foreground"
        }
      >
        {value}
        {unit && (
          <span className="ml-1 text-sm font-semibold text-muted">{unit}</span>
        )}
      </p>
    </div>
  );
}
