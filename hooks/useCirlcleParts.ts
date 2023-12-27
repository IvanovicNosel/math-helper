// useCircleParts.ts
import { useMemo } from "react";

interface CirclePart {
  start: { x: number; y: number };
  end: { x: number; y: number };
  largeArcFlag: number;
  color: string;
}

const useCircleParts = (parts: number, colors: string[]): CirclePart[] => {
  const radius = 60;

  return useMemo(() => {
    return Array.from({ length: parts }).map((_, i) => {
      const startAngle = (i * 2 * Math.PI) / parts - Math.PI / 2;
      const endAngle = ((i + 1) * 2 * Math.PI) / parts - Math.PI / 2;
      const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;
      const start = {
        x: 60 + radius * Math.cos(startAngle),
        y: 60 + radius * Math.sin(startAngle),
      };
      const end = {
        x: 60 + radius * Math.cos(endAngle),
        y: 60 + radius * Math.sin(endAngle),
      };
      const color = colors[i % colors.length];
      return { start, end, largeArcFlag, color };
    });
  }, [parts, colors, radius]);
};

export default useCircleParts;
