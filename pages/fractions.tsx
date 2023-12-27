"use client";
import Button from "@/components/Button";
import Circle from "@/components/Circle";
import Slider from "@/components/Slider";
import Center from "@/layouts/Center";
import PageLayout from "@/layouts/PageLayout";
import React, { useMemo, useState } from "react";

type Format = "fraction" | "decimal" | "percentage";

/**
 * This pages displays an interactive playground for kids to learn about fractions.
 * The page contains a colored circle that can be divided into equal parts.
 * Below it is a label with the fraction's value.
 * Below that is a series of controls to:
 * - change the number of parts the circle is divided into
 * - change the label's value format (fraction, decimal, percentage)
 *
 * Each time the circle is divided, the label's value is updated. Each part of the circle is colored differently.
 */
export default function Factions() {
  const [parts, setParts] = useState(1);
  const [format, setFormat] = useState<Format>("fraction");

  const formatValue = (value: number, format: Format) => {
    switch (format) {
      case "fraction":
        return `1/${value}`;
      case "decimal":
        return (1 / value).toFixed(2);
      case "percentage":
        return `${((1 / value) * 100).toFixed(2)}%`;
      default:
        return value;
    }
  };

  const colors = useMemo(() => {
    const colors = [];
    for (let i = 0; i < parts; i++) {
      const hue = (i * 360) / parts;
      colors.push(`hsl(${hue}, 100%, 50%)`);
    }
    return colors;
  }, [parts]);

  return (
    <PageLayout>
      <Center>
        <div className="flex justify-center items-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center">
              <Circle parts={parts} colors={colors} />
              <Slider
                orientation="vertical"
                value={parts}
                min={1}
                max={10}
                step={1}
                onChange={(event, newValue) => setParts(newValue as number)}
                style={{ height: "240px", marginLeft: "20px" }}
              />
            </div>
            <div>{formatValue(parts, format)}</div>
            <div className="flex gap-1">
              <Button onClick={() => setFormat("fraction")}>Fraction</Button>
              <Button onClick={() => setFormat("decimal")}>Decimal</Button>
              <Button onClick={() => setFormat("percentage")}>
                Percentage
              </Button>
            </div>
          </div>
        </div>
      </Center>
    </PageLayout>
  );
}
