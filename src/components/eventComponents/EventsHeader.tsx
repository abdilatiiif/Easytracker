interface EventsHeaderProps {
  title?: string;
  count?: number;
  subtitle?: string;
}

export function EventsHeader({
  title = "Siste hendelser",
  count,
  subtitle = "En enkel oversikt over hendelsene som er hentet inn.",
}: EventsHeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
        {title}
        {typeof count === "number" ? (
          <span className="text-slate-500"> ({count})</span>
        ) : null}
      </h1>
      <p className="text-sm text-slate-600">{subtitle}</p>
    </div>
  );
}
