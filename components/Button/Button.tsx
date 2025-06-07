type ButtonProps = {
  children?: React.ReactNode;
  color: string;
  onClick?: () => void;
};

export const Button = (props: ButtonProps) => {
  const { children, color, onClick } = props;
  return (
    <button
      className={`${color} mt-5 py-4 w-full whitespace-nowrap rounded-sm text-[#FFFFFF] cursor-pointer`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
