import React, { useState, useEffect } from 'react';
import { getDynamicSpark, SparkItem } from '../data/dailySparkData';
import { Sparkles, RefreshCw } from 'lucide-react';

interface DailySparkProps {
  remainingTasks: number;
  totalTasks: number;
  focusStreak: number;
}

export const DailySpark: React.FC<DailySparkProps> = ({
  remainingTasks,
  totalTasks,
  focusStreak,
}) => {
  const [spark, setSpark] = useState<SparkItem>(() =>
    getDynamicSpark(remainingTasks, totalTasks, focusStreak)
  );
  const [isFading, setIsFading] = useState(false);

  const rotateSpark = () => {
    setIsFading(true);
    setTimeout(() => {
      setSpark(getDynamicSpark(remainingTasks, totalTasks, focusStreak));
      setIsFading(false);
    }, 250);
  };

  // Rotate spark every 45 seconds
  useEffect(() => {
    const interval = setInterval(rotateSpark, 45000);
    return () => clearInterval(interval);
  }, [remainingTasks, totalTasks, focusStreak]);

  return (
    <div
      onClick={rotateSpark}
      title="Click to spark another thought"
      className="group flex items-center gap-2 cursor-pointer select-none py-1"
    >
      <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#28537D] dark:text-[#99BFF9] bg-[#99BFF9]/15 dark:bg-[#99BFF9]/20 px-2 py-0.5 rounded-full shrink-0">
        <Sparkles className="w-3 h-3 text-[#99BFF9]" />
        <span>{spark.type}</span>
      </span>

      <p
        className={`text-sm sm:text-base font-editorial italic text-slate-600 dark:text-slate-300 transition-all duration-300 ${
          isFading ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
        }`}
      >
        "{spark.text}"
      </p>

      <RefreshCw className="w-3 h-3 text-slate-300 group-hover:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
    </div>
  );
};
