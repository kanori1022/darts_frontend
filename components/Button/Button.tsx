type ButtonProps = {
  children?: React.ReactNode;
  color: string;
};

export const Button = (props: ButtonProps) => {
  return (
    <button
      className={`${props.color} mt-5 py-4 w-full whitespace-nowrap rounded-sm text-[#FFFFFF] cursor-pointer`}
    >
      {props.children}
    </button>
  );
};
