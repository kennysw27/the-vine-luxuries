export function Card({ children, className = '', hoverable = false }) {
  const hoverClasses = hoverable 
    ? 'transition-all duration-700 hover:-translate-y-2' 
    : '';

  return (
    <div className={`p-8 md:p-12 bg-white/50 backdrop-blur-sm ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
}
