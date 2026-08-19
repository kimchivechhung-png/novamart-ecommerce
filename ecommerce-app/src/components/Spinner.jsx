export default function Spinner({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-ink/50">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink/15 border-t-primary" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
