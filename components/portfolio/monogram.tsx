export function Monogram({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="38" height="38" viewBox="0 0 38 38" fill="none" aria-hidden="true">
      <path d="M5 30V9l10 13L25 9v21M15 30 26 8l9 22M20 23h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  );
}
