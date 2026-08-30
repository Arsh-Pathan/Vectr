export default function Card({ children, className = '', hover = true, ...props }) {
  const baseStyle = "bg-white rounded-xl shadow-sm border border-border p-6";
  const hoverStyle = hover ? "hover:-translate-y-1 hover:shadow-md transition-all duration-300" : "";

  return (
    <div className={`${baseStyle} ${hoverStyle} ${className}`} {...props}>
      {children}
    </div>
  );
}
