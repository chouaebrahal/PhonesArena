export default function LoadingSpinner({ 
  size = 'md',
  color = 'indigo',
  label = 'Loading...'
}: { 
  size?: 'sm' | 'md' | 'lg';
  color?: 'indigo' | 'blue' | 'red' | 'green';
  label?: string;
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const colorClasses = {
    indigo: 'border-t-indigo-600',
    blue: 'border-t-blue-600',
    red: 'border-t-red-600',
    green: 'border-t-green-600'
  };

  return (
    <div 
      className={`animate-spin ${sizeClasses[size]} border-2 border-gray-300 ${colorClasses[color]} rounded-full`}
      role="status"
      aria-label={label}
    />
  );
}
