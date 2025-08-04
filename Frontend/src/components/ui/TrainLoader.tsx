import { Train } from "lucide-react";

export const TrainLoader = ({ size = 40, className = "" }: { size?: number; className?: string }) => {
  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      {[0, 1, 2, 3].map((i) => (
        <div 
          key={i}
          className="animate-bounce"
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: '0.8s',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)'
          }}
        >
          <Train 
            className="text-primary" 
            size={size / 2} 
            style={{
              transform: `translateY(${i % 2 === 0 ? '0' : '5px'})`,
              opacity: 0.7 + (i * 0.1)
            }} 
          />
        </div>
      ))}
    </div>
  );
};
