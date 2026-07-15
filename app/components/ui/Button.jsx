'use client';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-full font-medium transition-colors duration-200';
  
  const variants = {
    primary: 'bg-white text-[#1B2333] hover:bg-gray-100',
    secondary: 'bg-transparent border border-white text-white hover:bg-white hover:text-[#1B2333]',
    outline: 'border border-gray-300 text-gray-700 hover:border-gray-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
    className="px-[15px] xl:px-[33.63px] xl:text-base text-xs xl:py-4 py-2 rounded-lg text-[#1B263B] bg-white hover:bg-gray-100 "

      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 