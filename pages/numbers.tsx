"use client";
import { useState } from "react";
import Button from "../components/Button";
import PageLayout from "@/layouts/PageLayout";

type ColorScheme = "digit" | "digit-group";
type NumberDigit = { location: number; numberLength: number };

type DigitDisplayProps = {
  digit: NumberDigit;
  colorScheme: ColorScheme;
};

type DigitTransformer<T = string> = (props: DigitDisplayProps) => T;

/**
 * Generates a random number between 0 and 100 000 000 000, each digit in a box with a different color.
 * The boxes' color are based on the digit's location in the number so that:
 *  - units are in light green
 *  - tens are in light blue
 *  - hundreds are in light read
 *  - thousands are in light green and so on.
 * The number is generated on each page refresh or with the refresh button.
 * The number is displayed in a grid with 10 columns and as many rows as needed.
 * The grid is centered on the page.
 * The boxes are 50px wide and 50px high.
 * @returns
 */
export default function Numbers() {
  const [number, setNumber] = useState(0);
  const [boxes, setBoxes] = useState<string[]>([]);
  const [colorScheme, setColorScheme] = useState<ColorScheme>("digit-group");

  const [power, setPower] = useState(6); // default power is 6 for 1,000,000

  const generateRandomNumber = () => {
    const maxNumber = Math.pow(10, power);
    const randomNumber = Math.floor(Math.random() * maxNumber);
    setNumber(randomNumber);
    setBoxes(randomNumber.toString().split(""));
  };

  /**
   * Returns the color of the box based on the digit's location in the number. For instance:
   * - units are in light green
   * - tens are in light blue
   * - hundreds are in light read
   * - thousands are in light green and so on.
   * @param index
   * @param numberOfDigits
   */
  const getBoxColor: DigitTransformer = ({
    digit: { location, numberLength },
    colorScheme,
  }) => {
    const colors =
      colorScheme === "digit-group"
        ? ["bg-green-200", "bg-blue-200", "bg-red-200"]
        : ["bg-green-200", "bg-blue-200", "bg-red-200"];

    if (colorScheme === "digit-group") {
      const groupIndex = Math.floor((numberLength - 1 - location) / 3) % colors.length;
      return colors[groupIndex];
    }

    const colorIndex = (numberLength - 1 - location) % colors.length;
    return colors[colorIndex];
  };

  const getBoxPosition = (index: number) => {
    const row = Math.floor(index / 10);
    const col = index % 10;
    return `row-start-${row + 1} col-start-${col + 1}`;
  };

  const getBoxStyle = (index: number) => {
    return `${getBoxPosition(index)}`;
  };

  const getBoxText = (index: number) => {
    return boxes[index];
  };

  const getBoxClass: DigitTransformer = ({ digit, colorScheme }) => {
    return `${getBoxColor({ digit, colorScheme })} ${getBoxStyle(
      digit.location
    )}`;
  };

  const getBox: DigitTransformer<React.ReactNode> = ({
    digit,
    colorScheme,
  }) => {
    const { location } = digit;
    return (
      <div key={location} className={getBoxClass({ digit, colorScheme })}>
        {getBoxText(location)}
      </div>
    );
  };

  const getBoxes = (colorScheme: ColorScheme) => {
    return boxes.map((box, index) =>
      getBox({
        digit: { location: index, numberLength: boxes.length },
        colorScheme,
      })
    );
  };

  const getGridClass = () => {
    const rows = Math.ceil(boxes.length / 10); // Use boxes.length to ensure proper calculation
    return `grid grid-cols-10 text-slate-900 text-9xl grid-rows-${rows} gap-1`;
  };

  const NumberGrid = () => {
    return <div className={getGridClass()}>{getBoxes(colorScheme)}</div>;
  };

  const RefreshButton = () => {
    return <Button onClick={generateRandomNumber}>Refresh</Button>;
  };

  const ColorSchemeToggleButton = () => {
    return (
      <Button
        onClick={() => {
          setColorScheme(
            colorScheme === "digit-group" ? "digit" : "digit-group"
          );
        }}
      >
        {colorScheme === "digit-group" ? "digit" : "digit-group"}
      </Button>
    );
  };

  const PowerControls = () => {
    return (
      <div className="flex items-center">
        <Button
          onClick={() => setPower((prevPower) => Math.max(prevPower - 1, 1))}
        >
          -
        </Button>
        <span className="mx-2">Power: {power}</span>
        <Button
          onClick={() => setPower((prevPower) => Math.min(prevPower + 1, 10))}
        >
          +
        </Button>
      </div>
    );
  };

  const NumberSection = () => {
    return (
      <div className="flex flex-col items-center justify-center">
        <NumberGrid />
        <div className="flex flex-row space-x-4 mt-4">
          <RefreshButton />
          <ColorSchemeToggleButton />
          <PowerControls />
        </div>
      </div>
    );
  };

  return (
    <PageLayout>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
          <NumberSection />
        </div>
      </main>
    </PageLayout>
  );
}
