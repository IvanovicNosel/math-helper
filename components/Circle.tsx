import useCircleParts from "@/hooks/useCirlcleParts";
import React from "react";

interface CircleProps {
  parts: number;
  colors: string[];
}

const Circle: React.FC<CircleProps> = ({ parts, colors }) => {
  const circleParts = useCircleParts(parts, colors);

  if (parts === 1) {
    return (
      <svg viewBox="0 0 120 120" className="circle">
        <circle cx="60" cy="60" r="60" fill={colors[0]} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 120 120" className="circle">
      {circleParts.map((part, i) => (
        <path
          key={i}
          d={`M ${part.start.x} ${part.start.y} A 60 60 0 ${part.largeArcFlag} 1 ${part.end.x} ${part.end.y} L 60 60 Z`}
          fill={part.color}
        />
      ))}
    </svg>
  );
};

export default Circle;
