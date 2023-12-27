import { PropsWithChildren } from "react";

const Center = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex items-center justify-center">{children}</div>
    </div>
  );
};

export default Center;
