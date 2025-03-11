
import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

interface CountdownTimerProps {
  deadline: Date;
  onExpire?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ deadline, onExpire }) => {
  const calculateTimeLeft = () => {
    const difference = new Date(deadline).getTime() - new Date().getTime();
    
    if (difference <= 0) {
      if (onExpire) onExpire();
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
      total: difference,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  
  // Calculate the total time and elapsed time
  const totalTime = new Date(deadline).getTime() - new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).getTime(); // Assuming project started 7 days ago
  const elapsedPercent = ((totalTime - timeLeft.total) / totalTime) * 100;

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      if (newTimeLeft.total <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  const timeDisplay = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="w-full glass-card p-6 rounded-lg animate-fade-in">
      <div className="mb-4">
        <div className="flex justify-between mb-1 text-sm text-foreground/70">
          <span>Time elapsed</span>
          <span>Deadline: {new Date(deadline).toLocaleDateString()}</span>
        </div>
        <Progress value={elapsedPercent} className="h-2" />
      </div>
      
      <div className="grid grid-cols-4 gap-2 text-center">
        {timeDisplay.map((item) => (
          <div key={item.label} className="flex flex-col">
            <div className="text-2xl font-medium">{item.value.toString().padStart(2, "0")}</div>
            <div className="text-xs text-foreground/70">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
