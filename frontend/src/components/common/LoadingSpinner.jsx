const LoadingSpinner = ({ size = 'medium', text = 'Loading...', color = 'indigo' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-16 w-16'
  };

  const colorClasses = {
    indigo: 'border-indigo-600',
    purple: 'border-purple-600',
    blue: 'border-blue-600',
    green: 'border-green-600'
  };

  return (
    <div className="flex flex-col items-center justify-center animate-fade-in">
      <div className="relative">
        {/* Outer rotating ring */}
        <div className={`animate-spin rounded-full border-4 border-gray-200 ${sizeClasses[size]}`}></div>
        {/* Inner rotating ring */}
        <div className={`absolute top-0 animate-spin rounded-full border-4 border-transparent ${colorClasses[color]} border-t-transparent ${sizeClasses[size]}`} style={{animationDuration: '1s'}}></div>
        {/* Pulsing center dot */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-${color}-600 rounded-full animate-pulse`}></div>
      </div>
      
      {text && (
        <div className="mt-4 text-center">
          <p className="text-gray-700 font-medium animate-pulse">{text}</p>
          <div className="flex justify-center mt-2 space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner