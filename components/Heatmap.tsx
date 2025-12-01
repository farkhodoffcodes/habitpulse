import React from 'react';
import { motion } from 'framer-motion';

interface HeatmapProps {
  data: boolean[];
  activeColor?: string;
}

export const Heatmap: React.FC<HeatmapProps> = ({ data, activeColor = 'bg-yellow-400' }) => {
  // We display a grid of 7 rows (days) by X columns
  // The input data is a flat array. We need to chunk it carefully or just map it.
  // For the specific design in the image, it looks like a continuous grid.
  
  // Let's create a visual grid 7x4 (28 days)
  const displayData = data.slice(0, 28); 
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="flex flex-row gap-1">
      {/* Day Labels Column */}
      <div className="flex flex-col justify-between mr-2 py-0.5">
        {daysOfWeek.map((day, i) => (
          <span key={i} className="text-[10px] text-zinc-500 font-medium leading-none h-3 flex items-center">{day}</span>
        ))}
      </div>
      
      {/* Grid */}
      <div className="grid grid-rows-7 grid-flow-col gap-1.5">
        {displayData.map((completed, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.01 }}
            className={`w-3 h-3 rounded-[2px] ${completed ? activeColor : 'bg-zinc-800/50'}`}
          />
        ))}
      </div>
    </div>
  );
};
