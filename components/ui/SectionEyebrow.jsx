export function SectionEyebrow({ children, className = '' }) {
  return (
    <div className={`flex flex-col items-start gap-4 mb-6 ${className}`}>
      <span className="font-body text-[var(--color-navy-900)] uppercase tracking-[0.2em] text-xs font-light">
        {children}
      </span>
      <div className="w-12 h-[1px] bg-[var(--color-gold-500)]"></div>
    </div>
  );
}
