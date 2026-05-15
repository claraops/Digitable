export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  onClick,
  ...props 
}) {
  const variants = {
    primary: 'bg-gold text-black-deep hover:bg-opacity-90',
    secondary: 'bg-gray-light text-black-deep hover:bg-opacity-80',
    outline: 'border-2 border-gold text-gold hover:bg-gold hover:text-black-deep',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg font-semibold transition-all duration-300 
        ${variants[variant]} ${sizes[size]} ${className}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
      {...props}
    >
      {children}
    </button>
  );
}