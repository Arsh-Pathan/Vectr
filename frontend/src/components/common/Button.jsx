export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyle = "rounded-full px-6 py-2.5 font-bold transition-all duration-200 flex items-center justify-center";
  
  const variants = {
    primary: "bg-[#4285F4] text-white hover:bg-[#3367D6]",
    secondary: "bg-white text-[#4285F4] border border-[#DADCE0] hover:bg-[#F8F9FA]",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
