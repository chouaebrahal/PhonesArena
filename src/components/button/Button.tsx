import React from 'react'

interface ButtonProps {
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({children}) => {
  return (
     <button type="submit" className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg shadow-md cursor-pointer transition-colors duration-500 hover:bg-white hover:text-purple-700">
        {children ? children : 'Click Me'}
     </button>
  )
}

export default Button