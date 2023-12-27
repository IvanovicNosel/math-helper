type ButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
};

/**
 * A blue button styled with tailwindcss.
 */
const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
