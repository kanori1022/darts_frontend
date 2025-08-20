type ButtonProps = {
  children?: React.ReactNode;
  color: string;
  onClick?: () => void;
};

export const Button = (props: ButtonProps) => {
  const { children, color, onClick } = props;
  return (
    <button
      className={`${color} mt-5 py-4 px-6 w-full whitespace-nowrap rounded-xl text-white font-semibold cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300/50 active:scale-95`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const SrcButton = (props: ButtonProps) => {
  const { children, color, onClick } = props;
  return (
    <button
      className={`${color} mt-5 py-1 w-30 whitespace-nowrap rounded-sm text-[#FFFFFF] cursor-pointer`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
